import { getToken } from "@services/authStorage";

export async function authorizedFetch(url: string, options: RequestInit =
{}) {
const token = await getToken();
const headers = {
"Content-Type": "application/json",
...(options.headers || {}),
...(token ? { Authorization: `Bearer ${token}` } : {}),
};
return fetch(url, {
...options,
headers,
});
}