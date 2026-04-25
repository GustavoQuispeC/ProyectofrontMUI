import { getAuthUser } from "@/shared/auth/auth.service";

export async function apiUsuario(url: string, options: RequestInit = {}) {
  const auth = getAuthUser();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const msg = error?.message || error?.error || error?.title || "Error en la petición";
      throw new Error(msg);
    }

    return response.json();
  } catch (err) {
    // Relanza el error si es un AbortError (es normal cuando se desmonta)
    if (err instanceof Error && err.name === "AbortError") {
      throw err;
    }
    throw err;
  }
}
