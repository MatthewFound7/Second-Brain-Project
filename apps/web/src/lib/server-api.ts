import type { PublicPage } from "@/lib/types";

const SERVER_API_BASE =
  process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function getPublicPage(slug: string): Promise<PublicPage> {
  const response = await fetch(`${SERVER_API_BASE}/public/${slug}`, {
    cache: "no-store",
  });

  return handleResponse<PublicPage>(response);
}