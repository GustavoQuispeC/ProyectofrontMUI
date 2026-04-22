export async function apiDni<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const msg =
      error?.message || error?.error || error?.title || "Error en la petición";

    throw new Error(msg);
  }

  return response.json();
}