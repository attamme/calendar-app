import Constants from "expo-constants";
import { Platform } from "react-native";
import config from "@/app/config.json";
import { getToken } from "@/services/authStorage";

function pickRuntimeHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.linkingUri,
    (Constants as any).expoGoConfig?.debuggerHost,
    (Constants as any).manifest2?.extra?.expoClient?.hostUri,
    (Constants as any).manifest?.debuggerHost,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate) {
      continue;
    }

    const match = candidate.match(/(\d{1,3}(?:\.\d{1,3}){3}|[a-z0-9.-]+)(?::\d+)?/i);

    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

function resolveLocalApiUrl(configuredUrl: string) {
  const normalizedUrl = configuredUrl.replace(/\/$/, "");

  if (Platform.OS === "web") {
    return normalizedUrl;
  }

  if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedUrl)) {
    return normalizedUrl;
  }

  const runtimeHost = pickRuntimeHost();

  if (!runtimeHost) {
    return normalizedUrl;
  }

  return normalizedUrl.replace(/localhost|127\.0\.0\.1/i, runtimeHost);
}

export const API_URL = resolveLocalApiUrl(config.API_URL);

export function createApiHeaders(headers: HeadersInit = {}) {
  const normalizedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (/ngrok/i.test(API_URL)) {
    normalizedHeaders["ngrok-skip-browser-warning"] = "69";
  }

  return normalizedHeaders;
}

export async function authorizedFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers = createApiHeaders({
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const requestUrl = path.startsWith("http") ? path : `${API_URL}${path}`;

  return fetch(requestUrl, {
    ...options,
    headers,
  });
}
