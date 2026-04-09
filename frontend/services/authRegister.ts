import { API_URL } from "@/services/api";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

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
    return "Registration failed";
  }
}

export default async function registerUser(payload: RegisterPayload) {
  const response = await fetch(`${API_URL}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Registration failed");
  }
}
