interface ApiError {
  message?: string;
  error?: string;
  title?: string;
}

export async function ApiRoles<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = data as ApiError;

    throw new Error(error?.message || error?.error || error?.title || "Error en la petición");
  }

  return data as T;
}
