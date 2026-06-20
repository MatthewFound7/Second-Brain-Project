import type { Page, PageCreate, PageUpdate, PublicPage } from "@/lib/types";

export type AuthUser = {
  id: number;
  email: string;
};

const API_BASE = "/api";

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = (await response.json()) as { detail?: unknown };

    if (typeof data.detail === "string") {
      return data.detail;
    }

    return "Request failed";
  }

  const text = await response.text();
  return text || "Request failed";
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function registerUser(payload: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthUser>(response);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthUser>(response);
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
  });

  await handleResponse<void>(response);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    cache: "no-store",
  });

  return handleResponse<AuthUser>(response);
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

export async function deletePage(pageId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/pages/${pageId}`, {
    method: "DELETE",
  });
  await handleResponse<void>(response);
}

export async function getPublicPage(slug: string): Promise<PublicPage> {
  const response = await fetch(`${API_BASE}/public/${slug}`, {
    cache: "no-store",
  });
  return handleResponse<PublicPage>(response);
}