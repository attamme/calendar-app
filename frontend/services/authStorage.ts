import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

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
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    if (session.token) {
      localStorage.setItem(TOKEN_KEY, session.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));

  if (session.token) {
    await SecureStore.setItemAsync(TOKEN_KEY, session.token);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getSession() {
  const rawSession =
    Platform.OS === "web" && typeof localStorage !== "undefined"
      ? localStorage.getItem(SESSION_KEY)
      : await SecureStore.getItemAsync(SESSION_KEY);

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
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

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
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await clearSession();
}
