export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
// const API_VERSION = import.meta.env.VITE_API_VERSION as string;

function buildUrl(path: string) {
  // Example: http://localhost:8000/api/patients/
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function http<TResponse>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<TResponse> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // DRF commonly returns 204 on delete
  if (res.status === 204) return undefined as TResponse;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // DRF validation errors often look like { field: ["msg"] }
    const message =
      (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    throw { status: res.status, message, data };
  }

  return data as TResponse;
}