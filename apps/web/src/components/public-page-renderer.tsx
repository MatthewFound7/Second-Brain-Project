import React from "react";

type Block = {
  type?: unknown;
  text?: unknown;
  level?: unknown;
};

type PublicPageRendererProps = {
  content: Record<string, unknown>;
};

function isBlockArray(value: unknown): value is Block[] {
  return Array.isArray(value);
}

function renderBlock(block: Block, index: number): React.ReactNode {
  const type = typeof block.type === "string" ? block.type : "paragraph";
  const text = typeof block.text === "string" ? block.text : "";

  if (type === "heading") {
    const level = typeof block.level === "number" ? block.level : 1;

    if (level === 1) {
      return (
        <h1 key={index} className="mb-4 text-4xl font-bold">
          {text}
        </h1>
      );
    }

    if (level === 2) {
      return (
        <h2 key={index} className="mb-3 text-3xl font-semibold">
          {text}
        </h2>
      );
    }

    return (
      <h3 key={index} className="mb-3 text-2xl font-semibold">
        {text}
      </h3>
    );
  }

  return (
    <p key={index} className="mb-4 leading-7 text-gray-800">
      {text}
    </p>
  );
}

export function PublicPageRenderer({
  content,
}: PublicPageRendererProps): React.ReactElement {
  const blocks = (content as { blocks?: unknown }).blocks;

  if (!isBlockArray(blocks) || blocks.length === 0) {
    return (
      <div className="p-1 text-sm text-gray-500">
        This page has no public content yet.
      </div>
    );
  }

  return <div>{blocks.map((block, index) => renderBlock(block, index))}</div>;
}