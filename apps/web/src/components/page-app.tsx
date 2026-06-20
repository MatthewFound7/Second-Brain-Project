"use client";

import { useCallback, useEffect, useState } from "react";

import { AuthPanel } from "@/components/auth-panel";
import { PageEditor } from "@/components/page-editor";
import { PageSidebar } from "@/components/page-sidebar";
import { createEmptyPageContent, isPageContent } from "@/lib/content";
import {
  createPage,
  deletePage,
  getCurrentUser,
  getPage,
  listPages,
  loginUser,
  logoutUser,
  registerUser,
  updatePage,
  type AuthUser,
} from "@/lib/api";
import type { Page, PageContent } from "@/lib/types";

export function PageApp(): React.ReactElement {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState<boolean>(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function checkAuth(): Promise<void> {
    try {
      setIsCheckingAuth(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  const refreshPages = useCallback(async (nextSelectedPageId?: number | null): Promise<void> => {
    if (currentUser === null) {
      setPages([]);
      setSelectedPageId(null);
      setSelectedPage(null);
      setIsLoadingPages(false);
      return;
    }

    try {
      setIsLoadingPages(true);
      setErrorMessage(null);

      const nextPages = await listPages();
      setPages(nextPages);

      if (nextPages.length === 0) {
        setSelectedPageId(null);
        setSelectedPage(null);
        return;
      }

      if (nextSelectedPageId !== undefined) {
        setSelectedPageId(nextSelectedPageId);
        return;
      }

      if (selectedPageId === null) {
        setSelectedPageId(nextPages[0].id);
        return;
      }

      const selectedStillExists = nextPages.some((page) => page.id === selectedPageId);

      if (!selectedStillExists) {
        setSelectedPageId(nextPages[0].id);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load pages");
    } finally {
      setIsLoadingPages(false);
    }
  }, [currentUser, selectedPageId]);

  async function loadPage(pageId: number): Promise<void> {
    try {
      setIsLoadingPage(true);
      setErrorMessage(null);

      const page = await getPage(pageId);

      if (!isPageContent(page.content)) {
        throw new Error("Page content has an invalid structure");
      }

      setSelectedPage(page);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load page");
    } finally {
      setIsLoadingPage(false);
    }
  }

  async function handleRegister(payload: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      setIsSubmittingAuth(true);
      setErrorMessage(null);

      await registerUser(payload);
      const user = await loginUser(payload);
      setCurrentUser(user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to register");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleLogin(payload: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      setIsSubmittingAuth(true);
      setErrorMessage(null);

      const user = await loginUser(payload);
      setCurrentUser(user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleLogout(): Promise<void> {
    try {
      setErrorMessage(null);
      await logoutUser();
      setCurrentUser(null);
      setPages([]);
      setSelectedPageId(null);
      setSelectedPage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign out");
    }
  }

  async function handleCreatePage(): Promise<void> {
    try {
      setErrorMessage(null);

      const newPage = await createPage({
        title: "Untitled",
        content: createEmptyPageContent(),
      });

      await refreshPages(newPage.id);
      setSelectedPage(newPage);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create page");
    }
  }

  async function handleSelectPage(pageId: number): Promise<void> {
    setSelectedPageId(pageId);
  }

  async function handleDeletePage(): Promise<void> {
    if (selectedPageId === null) {
      return;
    }

    try {
      setErrorMessage(null);

      const remainingPages = pages.filter((page) => page.id !== selectedPageId);
      const nextSelectedPageId = remainingPages.length > 0 ? remainingPages[0].id : null;

      await deletePage(selectedPageId);
      await refreshPages(nextSelectedPageId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete page");
    }
  }

  async function handleSavePage(updatedFields: {
    title: string;
    slug: string | null;
    is_public: boolean;
    content: PageContent;
  }): Promise<void> {
    if (selectedPageId === null) {
      return;
    }

    try {
      setErrorMessage(null);

      const updatedPage = await updatePage(selectedPageId, {
        title: updatedFields.title,
        slug: updatedFields.slug,
        is_public: updatedFields.is_public,
        content: updatedFields.content,
      });

      setSelectedPage(updatedPage);

      setPages((currentPages) =>
        currentPages.map((page) =>
          page.id === updatedPage.id ? updatedPage : page,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save page",
      );
    }
  }

  useEffect(() => {
    void checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser !== null) {
      void refreshPages();
      return;
    }

    setPages([]);
    setSelectedPageId(null);
    setSelectedPage(null);
    setIsLoadingPages(false);
  }, [currentUser, refreshPages]);

  useEffect(() => {
    if (selectedPageId !== null) {
      void loadPage(selectedPageId);
    } else {
      setSelectedPage(null);
    }
  }, [selectedPageId]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">Checking session...</div>
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        {errorMessage !== null ? (
          <div className="mx-auto mb-6 max-w-md rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <AuthPanel
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isSubmittingAuth}
        />
      </main>
    );
  }

  return (
    <div className="flex h-screen">
      <PageSidebar
        pages={pages}
        selectedPageId={selectedPageId}
        isLoading={isLoadingPages}
        onCreatePage={handleCreatePage}
        onSelectPage={handleSelectPage}
      />

      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-between border-b bg-white px-6 py-3">
          <div>
            <div className="text-sm text-gray-500">Signed in as</div>
            <div className="text-sm font-medium">{currentUser.email}</div>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>

        {errorMessage !== null ? (
          <div className="border-b bg-red-50 px-6 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <PageEditor
          key={selectedPage?.id ?? "empty"}
          page={selectedPage}
          isLoading={isLoadingPage}
          onDelete={handleDeletePage}
          onSave={handleSavePage}
        />
      </main>
    </div>
  );
}