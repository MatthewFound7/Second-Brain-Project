"use client";

import { useEffect, useState, useCallback } from "react";

import { createPage, getPage, listPages, updatePage } from "@/lib/api";
import type { Page } from "@/lib/types";
import { PageEditor } from "@/components/page-editor";
import { PageSidebar } from "@/components/page-sidebar";

export function PageApp() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState<boolean>(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshPages = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingPages(true);
      setErrorMessage(null);

      const nextPages = await listPages();
      setPages(nextPages);

      if (nextPages.length > 0 && selectedPageId === null) {
        setSelectedPageId(nextPages[0].id);
      }

      if (nextPages.length === 0) {
        setSelectedPageId(null);
        setSelectedPage(null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load pages");
    } finally {
      setIsLoadingPages(false);
    }
  }, [selectedPageId]);

  async function loadPage(pageId: number): Promise<void> {
    try {
      setIsLoadingPage(true);
      setErrorMessage(null);
      const page = await getPage(pageId);
      setSelectedPage(page);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load page");
    } finally {
      setIsLoadingPage(false);
    }
  }

  async function handleCreatePage(): Promise<void> {
    try {
      setErrorMessage(null);
      const newPage = await createPage({
        title: "Untitled",
        content: {
          type: "doc",
          blocks: [],
        },
      });

      const nextPages = await listPages();
      setPages(nextPages);
      setSelectedPageId(newPage.id);
      setSelectedPage(newPage);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create page");
    }
  }

  async function handleSelectPage(pageId: number): Promise<void> {
    setSelectedPageId(pageId);
  }

  async function handleSavePage(updatedFields: {
    title: string;
    slug: string | null;
    is_public: boolean;
    contentText: string;
  }): Promise<void> {
    if (selectedPageId === null) {
      return;
    }

    try {
      setErrorMessage(null);

      const parsedContent = JSON.parse(updatedFields.contentText) as Record<string, unknown>;

      const updatedPage = await updatePage(selectedPageId, {
        title: updatedFields.title,
        slug: updatedFields.slug,
        is_public: updatedFields.is_public,
        content: parsedContent,
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
    void refreshPages();
  }, [refreshPages]);

  useEffect(() => {
    if (selectedPageId !== null) {
      void loadPage(selectedPageId);
    }
  }, [selectedPageId]);

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
        {errorMessage !== null ? (
          <div className="border-b bg-red-50 px-6 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <PageEditor
          key={selectedPage?.id ?? "empty"}
          page={selectedPage}
          isLoading={isLoadingPage}
          onSave={handleSavePage}
        />
      </main>
    </div>
  );
}