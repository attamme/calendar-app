import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "calendar-app-session";
const TOKEN_KEY = "token";

export type StoredUser = {
  id?: number;
  username?: string;
  email?: string;
};

export type StoredSession =
  | {
      mode: "authenticated";
      token: string;
      user: StoredUser | null;
    }
  | {
      mode: "guest";
      token: null;
      user: null;
    };

export async function saveSession(session: StoredSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));

  if (session.token) {
    await SecureStore.setItemAsync(TOKEN_KEY, session.token);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getSession() {
  const rawSession = await SecureStore.getItemAsync(SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(SESSION_KEY),
    SecureStore.deleteItemAsync(TOKEN_KEY),
  ]);
}

export async function saveToken(token: string) {
  await saveSession({
    mode: "authenticated",
    token,
    user: null,
  });
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await clearSession();
}
