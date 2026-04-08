import { saveToken } from "@/services/authStorage";
import {API_URL} from "@/app/config.json";

export default async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69",
      
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }

  const token = await res.json();


  await saveToken(token);
}