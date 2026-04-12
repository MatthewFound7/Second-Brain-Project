"use client";

import { useState } from "react";

import {
  createHeadingBlock,
  createParagraphBlock,
  isPageContent,
} from "@/lib/content";
import type { Page, PageBlock, PageContent } from "@/lib/types";

type PageEditorProps = {
  page: Page | null;
  isLoading: boolean;
  onSave: (payload: {
    title: string;
    slug: string | null;
    is_public: boolean;
    content: PageContent;
  }) => Promise<void>;
};

function getInitialTitle(page: Page | null): string {
  return page?.title ?? "";
}

function getInitialSlug(page: Page | null): string {
  return page?.slug ?? "";
}

function getInitialIsPublic(page: Page | null): boolean {
  return page?.is_public ?? false;
}

function getInitialBlocks(page: Page | null): PageBlock[] {
  if (page === null) {
    return [];
  }

  if (isPageContent(page.content)) {
    return page.content.blocks;
  }

  return [];
}

export function PageEditor({
  page,
  isLoading,
  onSave,
}: PageEditorProps) {
  const [title, setTitle] = useState<string>(() => getInitialTitle(page));
  const [slug, setSlug] = useState<string>(() => getInitialSlug(page));
  const [isPublic, setIsPublic] = useState<boolean>(() => getInitialIsPublic(page));
  const [blocks, setBlocks] = useState<PageBlock[]>(() => getInitialBlocks(page));
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  function updateBlock(index: number, updatedBlock: PageBlock): void {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block, blockIndex) =>
        blockIndex === index ? updatedBlock : block,
      ),
    );
  }

  function removeBlock(index: number): void {
    setBlocks((currentBlocks) =>
      currentBlocks.filter((_, blockIndex) => blockIndex !== index),
    );
  }

  function addParagraphBlock(): void {
    setBlocks((currentBlocks) => [...currentBlocks, createParagraphBlock("")]);
  }

  function addHeadingBlock(): void {
    setBlocks((currentBlocks) => [...currentBlocks, createHeadingBlock("", 1)]);
  }

  async function handleSubmit(
    event: React.ChangeEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await onSave({
      title,
      slug: slug.trim() === "" ? null : slug.trim(),
      is_public: isPublic,
      content: {
        type: "doc",
        blocks,
      },
    });

    setSaveMessage("Saved");
  }

  const publicUrl = isPublic && slug.trim() !== "" ? `/p/${slug.trim()}` : null;

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
          <p className="mt-2 text-xs text-gray-500">
            Used for the public URL. Example: /p/my-public-page
          </p>
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

        {publicUrl ? (
          <div className="rounded bg-gray-50 p-3 text-sm">
            <span className="font-medium">Public URL:</span>{" "}
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {publicUrl}
            </a>
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Content Blocks</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addParagraphBlock}
                className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Add Paragraph
              </button>
              <button
                type="button"
                onClick={addHeadingBlock}
                className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Add Heading
              </button>
            </div>
          </div>

          {blocks.length === 0 ? (
            <div className="rounded border border-dashed p-4 text-sm text-gray-500">
              No content blocks yet. Add a heading or paragraph to start.
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <BlockEditor
                  key={index}
                  block={block}
                  index={index}
                  onChange={updateBlock}
                  onRemove={removeBlock}
                />
              ))}
            </div>
          )}
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

type BlockEditorProps = {
  block: PageBlock;
  index: number;
  onChange: (index: number, updatedBlock: PageBlock) => void;
  onRemove: (index: number) => void;
};

function BlockEditor({
  block,
  index,
  onChange,
  onRemove,
}: BlockEditorProps) {
  function handleTextChange(text: string): void {
    onChange(index, {
      ...block,
      text,
    });
  }

  function handleHeadingLevelChange(level: 1 | 2 | 3): void {
    if (block.type !== "heading") {
      return;
    }

    onChange(index, {
      ...block,
      level,
    });
  }

  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {block.type === "heading" ? "Heading Block" : "Paragraph Block"}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>

      {block.type === "heading" ? (
        <div className="mb-3">
          <label className="mb-2 block text-sm font-medium">Heading Level</label>
          <select
            value={block.level}
            onChange={(event) =>
              handleHeadingLevelChange(Number(event.target.value) as 1 | 2 | 3)
            }
            className="rounded border px-3 py-2 text-sm"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium">Text</label>
        <textarea
          value={block.text}
          onChange={(event) => handleTextChange(event.target.value)}
          className="min-h-[120px] w-full rounded border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}