import { getAuthUser, logout } from "@/shared/auth/auth.service";
import { getApiErrorMessage } from "./api-error";

export async function apiReporteCaja(url: string, options: RequestInit = {}) {
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

  if (response.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
