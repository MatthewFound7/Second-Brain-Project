"use client";

import { useState } from "react";

import type { Page } from "@/lib/types";

type PageEditorProps = {
  page: Page | null;
  isLoading: boolean;
  onSave: (payload: {
    title: string;
    slug: string | null;
    is_public: boolean;
    contentText: string;
  }) => Promise<void>;
};

export function PageEditor({
  page,
  isLoading,
  onSave,
}: PageEditorProps) {
  const [title, setTitle] = useState<string>(page?.title ?? "");
  const [slug, setSlug] = useState<string>(page?.slug ?? "");
  const [isPublic, setIsPublic] = useState<boolean>(page?.is_public ?? false);
  const [contentText, setContentText] = useState<string>(
    JSON.stringify(page?.content ?? {}, null, 2),
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await onSave({
      title,
      slug: slug.trim() === "" ? null : slug.trim(),
      is_public: isPublic,
      contentText,
    });

    setSaveMessage("Saved");
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading page...</div>;
  }

  if (page === null) {
    return <div className="p-6 text-sm text-gray-500">Select or create a page.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="my-public-page"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Public
          </label>
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Content JSON
          </label>
          <textarea
            id="content"
            value={contentText}
            onChange={(event) => setContentText(event.target.value)}
            className="min-h-[400px] w-full rounded border px-3 py-2 font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90"
          >
            Save
          </button>
          {saveMessage ? <span className="text-sm text-green-700">{saveMessage}</span> : null}
        </div>
      </form>
    </div>
  );
}