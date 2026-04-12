import type { HeadingBlock, PageBlock, PageContent, ParagraphBlock } from "@/lib/types";

export function createEmptyPageContent(): PageContent {
  return {
    type: "doc",
    blocks: [],
  };
}

export function createParagraphBlock(text = ""): ParagraphBlock {
  return {
    type: "paragraph",
    text,
  };
}

export function createHeadingBlock(
  text = "",
  level: 1 | 2 | 3 = 1,
): HeadingBlock {
  return {
    type: "heading",
    level,
    text,
  };
}

export function isPageContent(value: unknown): value is PageContent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const content = value as { type?: unknown; blocks?: unknown };

  if (content.type !== "doc" || !Array.isArray(content.blocks)) {
    return false;
  }

  return content.blocks.every(isPageBlock);
}

function isPageBlock(value: unknown): value is PageBlock {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const block = value as { type?: unknown; text?: unknown; level?: unknown };

  if (block.type === "paragraph") {
    return typeof block.text === "string";
  }

  if (block.type === "heading") {
    return (
      typeof block.text === "string" &&
      (block.level === 1 || block.level === 2 || block.level === 3)
    );
  }

  return false;
}