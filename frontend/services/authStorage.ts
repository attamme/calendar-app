import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "adhd-calendar-token";

function isWeb() {
  return Platform.OS === "web";
}

function getWebStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function canUseSecureStore() {
  return (
    !isWeb() &&
    typeof SecureStore.getItemAsync === "function" &&
    typeof SecureStore.setItemAsync === "function" &&
    typeof SecureStore.deleteItemAsync === "function"
  );
}

export async function saveToken(token: string) {
  if (!canUseSecureStore()) {
    getWebStorage()?.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  if (!canUseSecureStore()) {
    return getWebStorage()?.getItem(TOKEN_KEY) ?? null;
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  if (!canUseSecureStore()) {
    getWebStorage()?.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
