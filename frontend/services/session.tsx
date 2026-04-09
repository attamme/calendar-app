import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, saveSession, StoredSession } from "@/services/authStorage";

type SessionStatus = "anonymous" | "authenticated" | "guest";

type SessionContextValue = {
  isHydrated: boolean;
  status: SessionStatus;
  signIn: (session: Extract<StoredSession, { mode: "authenticated" }>) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [status, setStatus] = useState<SessionStatus>("anonymous");

  useEffect(() => {
    async function hydrateSession() {
      const storedSession = await getSession();

      if (storedSession?.mode === "authenticated") {
        setStatus("authenticated");
      } else if (storedSession?.mode === "guest") {
        setStatus("guest");
      } else {
        setStatus("anonymous");
      }

      setIsHydrated(true);
    }

    hydrateSession().catch(() => {
      setStatus("anonymous");
      setIsHydrated(true);
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      isHydrated,
      status,
      async signIn(session) {
        await saveSession(session);
        setStatus("authenticated");
      },
      async continueAsGuest() {
        await saveSession({
          mode: "guest",
          token: null,
          user: null,
        });
        setStatus("guest");
      },
      async signOut() {
        await clearSession();
        setStatus("anonymous");
      },
    }),
    [isHydrated, status],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }

  return context;
}
