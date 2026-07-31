import { getAuthUser } from "@/shared/auth/auth.service";

export async function apiProducto(url: string, options: RequestInit = {}) {
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
    const rawText = await response.text().catch(() => "");
    let errorBody: unknown = null;
    try {
      errorBody = rawText ? JSON.parse(rawText) : null;
    } catch {
      errorBody = null;
    }

    let msg: string | undefined;

    if (typeof errorBody === "string") {
      msg = errorBody;
    } else if (errorBody && typeof errorBody === "object") {
      const body = errorBody as Record<string, unknown>;
      msg = (body.message || body.detail || body.error || body.title) as string | undefined;

      if (!msg && body.errors && typeof body.errors === "object") {
        const validationErrors = Object.values(body.errors as Record<string, unknown>).flat();
        if (validationErrors.length > 0) {
          msg = validationErrors.join(" ");
        }
      }
    }

    if (!msg && rawText) {
      msg = rawText;
    }

    throw new Error(msg || `Error ${response.status}: ${response.statusText || "Error en la petición"}`);
  }

  return response.json();
}
