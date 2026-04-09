import { API_URL } from "@/services/api";
import { StoredSession } from "@/services/authStorage";

type LoginResponse = string | { token: string; user?: { id?: number; username?: string; email?: string } };

async function readErrorMessage(response: Response) {
  try {
    const payload = await response.json();
    if (typeof payload?.message === "string" && payload.message) {
      return payload.message;
    }
  } catch {}

  try {
    return await response.text();
  } catch {
    return "Login failed";
  }
}

export default async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Login failed");
  }

  const payload = (await response.json()) as LoginResponse;
  const token = typeof payload === "string" ? payload : payload.token;
  const user = typeof payload === "string" ? null : payload.user ?? null;

  if (!token) {
    throw new Error("Login response did not include a token.");
  }

  return {
    mode: "authenticated",
    token,
    user,
  } satisfies Extract<StoredSession, { mode: "authenticated" }>;
}
