import Constants from "expo-constants";

import config from "@/app/config.json";
import type {
  FriendConnection,
  PlannerCalendar,
  PlannerDashboard,
  PlannerItem,
  PlannerItemPayload,
  SessionUser,
  SharePermission,
} from "@/types/planner";
import { getToken } from "@/services/authStorage";

function deriveLocalApiBase() {
  const expoGoConfig = Constants.expoGoConfig as { debuggerHost?: string } | null;
  const hostSource =
    Constants.expoConfig?.hostUri ||
    expoGoConfig?.debuggerHost ||
    Constants.linkingUri;

  if (!hostSource) {
    return null;
  }

  const normalized = hostSource.replace(/^\w+:\/\//, "");
  const host = normalized.split("/")[0]?.split(":")[0];

  if (!host) {
    return null;
  }

  return `http://${host}:3000`;
}

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  deriveLocalApiBase() ||
  config.API_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: Record<string, unknown>;
  token?: string | null;
};

const REQUEST_TIMEOUT_MS = 15000;

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? (await getToken());
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(
      error instanceof Error && error.name === "AbortError"
        ? "The planner server took too long to respond. Check that the backend and tunnel are still running, then try again."
        : "Could not reach the planner server. Make sure the backend is running on port 3000 and the public tunnel is active."
    );
  }
  clearTimeout(timeoutId);

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export async function loginUser(email: string, password: string) {
  return apiRequest<{ token: string; user: SessionUser }>("/users/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function registerUser(username: string, email: string, password: string) {
  return apiRequest<{ token: string; user: SessionUser }>("/users/register", {
    method: "POST",
    body: { username, email, password },
  });
}

export async function fetchCurrentUser(token?: string | null) {
  return apiRequest<{ user: SessionUser }>("/users/me", { token });
}

export async function fetchDashboard(token?: string | null) {
  return apiRequest<PlannerDashboard>("/items/dashboard", { token });
}

export async function fetchItems(token?: string | null, view = "all") {
  return apiRequest<{ items: PlannerItem[] }>(`/items?view=${view}`, { token });
}

export async function fetchItem(id: number | string, token?: string | null) {
  return apiRequest<{ item: PlannerItem }>(`/items/${id}`, { token });
}

export async function createItem(payload: PlannerItemPayload, token?: string | null) {
  return apiRequest<{ item: PlannerItem }>("/items", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updateItem(
  id: number | string,
  payload: PlannerItemPayload,
  token?: string | null
) {
  return apiRequest<{ item: PlannerItem }>(`/items/${id}`, {
    method: "PATCH",
    body: payload,
    token,
  });
}

export async function shareItem(
  id: number | string,
  username: string,
  permission: Exclude<SharePermission, "owner">,
  token?: string | null
) {
  return apiRequest<{ shared: { itemId: number; userId: number; permission: SharePermission } }>(
    `/items/${id}/share`,
    {
      method: "POST",
      body: { username, permission },
      token,
    }
  );
}

export async function setMySharedItemCalendar(
  id: number | string,
  calendarId: number | null,
  token?: string | null
) {
  return apiRequest<{ item: PlannerItem }>(`/items/${id}/my-calendar`, {
    method: "PATCH",
    body: { calendarId },
    token,
  });
}

export async function fetchCalendars(token?: string | null) {
  return apiRequest<{ calendars: PlannerCalendar[] }>("/calendars", { token });
}

export async function createCalendar(
  payload: Pick<PlannerCalendar, "title" | "color" | "category" | "description">,
  token?: string | null
) {
  return apiRequest<{ calendar: PlannerCalendar }>("/calendars", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function shareCalendar(
  id: number | string,
  username: string,
  permission: Exclude<SharePermission, "owner">,
  token?: string | null
) {
  return apiRequest<{
    shared: { calendarId: number; userId: number; permission: SharePermission };
  }>(`/calendars/${id}/share`, {
    method: "POST",
    body: { username, permission },
    token,
  });
}

export async function fetchFriends(token?: string | null) {
  return apiRequest<{ friends: FriendConnection[] }>("/users/friends", { token });
}

export async function addFriend(username: string, token?: string | null) {
  return apiRequest<{ friend: FriendConnection }>("/users/friends", {
    method: "POST",
    body: { username },
    token,
  });
}
