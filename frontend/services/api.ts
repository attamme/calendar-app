import config from "@/app/config.json";
import { getToken } from "@/services/authStorage";

export const API_URL = config.API_URL.replace(/\/$/, "");

export async function authorizedFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const requestUrl = path.startsWith("http") ? path : `${API_URL}${path}`;

  return fetch(requestUrl, {
    ...options,
    headers,
  });
}
