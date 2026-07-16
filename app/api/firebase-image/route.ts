const FIREBASE_STORAGE_HOSTS = new Set(["firebasestorage.googleapis.com", "storage.googleapis.com"]);

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("url");

  if (!source) {
    return new Response("URL requerida", { status: 400 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(source);
  } catch {
    return new Response("URL inválida", { status: 400 });
  }

  if (imageUrl.protocol !== "https:" || !FIREBASE_STORAGE_HOSTS.has(imageUrl.hostname)) {
    return new Response("Origen no permitido", { status: 403 });
  }

  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) {
    return new Response("No se pudo obtener la imagen", { status: response.status });
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    return new Response("El recurso no es una imagen", { status: 415 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
