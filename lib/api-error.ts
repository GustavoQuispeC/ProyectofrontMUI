//! Extrae el mensaje de error enviado por el backend (JSON, texto plano o ProblemDetails)
export function extractApiErrorMessage(body: unknown, status: number, statusText?: string): string {
  let msg: string | undefined;

  if (typeof body === "string") {
    msg = body;
  } else if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    msg = (b.message ??
      b.mensaje ??
      b.Message ??
      b.Mensaje ??
      b.detail ??
      b.detalle ??
      b.error ??
      b.title) as string | undefined;

    if (!msg && b.errors && typeof b.errors === "object") {
      const validationErrors = Object.values(b.errors as Record<string, unknown>).flat();
      if (validationErrors.length > 0) {
        msg = validationErrors.join(" ");
      }
    }
  }

  return msg || `Error ${status}: ${statusText || "Error en la petición"}`;
}

//! Lee la respuesta de error y devuelve el mensaje del backend
export async function getApiErrorMessage(response: Response): Promise<string> {
  const rawText = await response.text().catch(() => "");

  let body: unknown = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    body = null;
  }

  if (body === null && rawText) {
    return rawText;
  }

  return extractApiErrorMessage(body, response.status, response.statusText);
}
