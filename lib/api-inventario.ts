import { getAuthUser } from "@/shared/auth/auth.service";
import { getApiErrorMessage } from "./api-error";

export async function apiInventario<T>(url: string, options: RequestInit = {}): Promise<T> {
  const auth = getAuthUser();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return response.json() as Promise<T>;
}
