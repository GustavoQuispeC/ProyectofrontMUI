import { extractApiErrorMessage } from "./api-error";

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
    throw new Error(extractApiErrorMessage(data, response.status, response.statusText));
  }

  return data as T;
}
