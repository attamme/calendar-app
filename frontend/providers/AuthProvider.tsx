import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, loginUser, registerUser } from "@/services/api";
import { deleteToken, getToken, saveToken } from "@/services/authStorage";
import type { SessionUser } from "@/types/planner";

type AuthContextValue = {
  user: SessionUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const storedToken = await getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser(storedToken);
        startTransition(() => {
          setToken(storedToken);
          setUser(response.user);
        });
      } catch (error) {
        await deleteToken();
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  async function signIn(email: string, password: string) {
    const response = await loginUser(email, password);
    await saveToken(response.token);

    startTransition(() => {
      setToken(response.token);
      setUser(response.user);
    });
  }

  async function signUp(username: string, email: string, password: string) {
    const response = await registerUser(username, email, password);
    await saveToken(response.token);

    startTransition(() => {
      setToken(response.token);
      setUser(response.user);
    });
  }

  async function signOut() {
    await deleteToken();

    startTransition(() => {
      setToken(null);
      setUser(null);
    });
  }

  async function refreshUser() {
    if (!token) {
      return;
    }

    const response = await fetchCurrentUser(token);
    startTransition(() => {
      setUser(response.user);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
