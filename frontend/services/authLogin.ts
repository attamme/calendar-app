import { saveToken } from "@/services/authStorage";
import {API_URL} from "@/app/config.json";

export default async function login(username: string, password: string) {
  console.log(API_URL + "/login")
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      
    },
    body: JSON.stringify({ username, password }),
  });
  console.log(res);
  if (!res.ok) {
    throw new Error("Login failed");
  }

  const token = await res.json();


  await saveToken(token);
}