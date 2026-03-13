import { saveToken } from "../services/authStorage";

async function login(username: string, password: string) {
  const res = await fetch("http://your-api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const token = await res.json();

  if (!res.ok) {
    throw new Error("Login failed");
  }

  await saveToken(token);
}