import { getApiErrorMessage } from "./api-error";

export async function apiCatalogo(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return response.json();
}
