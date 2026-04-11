export type Page = {
  id: number;
  title: string;
  slug: string | null;
  is_public: boolean;
  content: Record<string, unknown>;
};

export type PublicPage = {
  title: string;
  slug: string;
  content: Record<string, unknown>;
};

export type PageCreate = {
  title: string;
  content: Record<string, unknown>;
};

export type PageUpdate = {
  title?: string;
  slug?: string | null;
  is_public?: boolean;
  content?: Record<string, unknown>;
};