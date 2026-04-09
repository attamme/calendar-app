import { API_URL, createApiHeaders } from "@/services/api";

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
  let response: Response;

  try {
    response = await fetch(`${API_URL}/users/create`, {
      method: "POST",
      headers: createApiHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`Could not reach the backend at ${API_URL}.`);
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Registration failed");
  }
}
