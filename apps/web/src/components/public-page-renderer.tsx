import type { PageBlock, PageContent } from "@/lib/types";

type PublicPageRendererProps = {
  content: PageContent;
};

function renderBlock(block: PageBlock, index: number) {
  if (block.type === "heading") {
    if (block.level === 1) {
      return (
        <h1 key={index} className="mb-4 text-4xl font-bold">
          {block.text}
        </h1>
      );
    }

    if (block.level === 2) {
      return (
        <h2 key={index} className="mb-3 text-3xl font-semibold">
          {block.text}
        </h2>
      );
    }

    return (
      <h3 key={index} className="mb-3 text-2xl font-semibold">
        {block.text}
      </h3>
    );
  }

  return (
    <p key={index} className="mb-4 leading-7 text-gray-800">
      {block.text}
    </p>
  );
}

export function PublicPageRenderer({
  content,
}: PublicPageRendererProps) {
  if (content.blocks.length === 0) {
    return (
      <div className="rounded border border-dashed p-6 text-sm text-gray-500">
        This page has no public content yet.
      </div>
    );
  }

  return <div>{content.blocks.map((block, index) => renderBlock(block, index))}</div>;
}