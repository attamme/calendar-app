import { API_URL } from "@/services/api";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

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
    const message = await response.text();
    throw new Error(message || "Registration failed");
  }
}
