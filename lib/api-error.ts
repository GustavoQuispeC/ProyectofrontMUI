//! Extrae el mensaje de error enviado por el backend (JSON, texto plano o ProblemDetails)
export function extractApiErrorMessage(body: unknown, status: number, statusText?: string): string {
  let msg: string | undefined;

  if (typeof body === "string") {
    msg = body;
  } else if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    msg = (b.message ?? b.mensaje ?? b.Message ?? b.Mensaje ?? b.detail ?? b.detalle ?? b.title) as string | undefined;

    // error puede ser string u objeto { message, code, description }
    if (!msg && b.error) {
      if (typeof b.error === "string") {
        msg = b.error;
      } else if (typeof b.error === "object") {
        const e = b.error as Record<string, unknown>;
        msg = (e.message ?? e.mensaje ?? e.description ?? e.descripcion ?? e.code) as string | undefined;
      }
    }

    // errors puede ser { campo: [msgs] } (ProblemDetails) o [{ errorMessage }] (FluentValidation)
    if (!msg && b.errors && typeof b.errors === "object") {
      const validationErrors = Object.values(b.errors as Record<string, unknown>)
        .flat()
        .map((e) => {
          if (typeof e === "string") return e;
          if (e && typeof e === "object") {
            const err = e as Record<string, unknown>;
            return (err.errorMessage ?? err.message ?? err.mensaje) as string | undefined;
          }
          return undefined;
        })
        .filter(Boolean);
      if (validationErrors.length > 0) {
        msg = validationErrors.join(" ");
      }
    }

    // listas de mensajes tipo { mensajes: [...] } / { messages: [...] }
    if (!msg) {
      for (const key of ["mensajes", "messages", "errores"]) {
        const v = b[key];
        if (Array.isArray(v) && v.length > 0) {
          msg = v.join(" ");
          break;
        }
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

  console.log("[ApiError]", response.status, body);

  return extractApiErrorMessage(body, response.status, response.statusText);
}
