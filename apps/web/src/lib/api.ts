import type { Page, PageCreate, PageUpdate } from "@/lib/types";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function listPages(): Promise<Page[]> {
  const response = await fetch(`${API_BASE}/pages`, {
    cache: "no-store",
  });
  return handleResponse<Page[]>(response);
}

export async function getPage(pageId: number): Promise<Page> {
  const response = await fetch(`${API_BASE}/pages/${pageId}`, {
    cache: "no-store",
  });
  return handleResponse<Page>(response);
}

export async function createPage(payload: PageCreate): Promise<Page> {
  const response = await fetch(`${API_BASE}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Page>(response);
}

export async function updatePage(pageId: number, payload: PageUpdate): Promise<Page> {
  const response = await fetch(`${API_BASE}/pages/${pageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Page>(response);
}