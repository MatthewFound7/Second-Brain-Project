export type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type HeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
};

export type PageBlock = ParagraphBlock | HeadingBlock;

export type PageContent = {
  type: "doc";
  blocks: PageBlock[];
};

export type Page = {
  id: number;
  title: string;
  slug: string | null;
  is_public: boolean;
  content: PageContent;
};

export type PublicPage = {
  title: string;
  slug: string;
  content: PageContent;
};

export type PageCreate = {
  title: string;
  content: PageContent;
};

export type PageUpdate = {
  title?: string;
  slug?: string | null;
  is_public?: boolean;
  content?: PageContent;
};