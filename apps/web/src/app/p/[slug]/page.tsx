import { notFound } from "next/navigation";

import { PublicPageRenderer } from "@/components/public-page-renderer";
import { getPublicPage } from "@/lib/server-api";

type PublicPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicPageRoute({
  params,
}: PublicPageRouteProps): Promise<React.ReactElement> {
  const { slug } = await params;

  let page;

  try {
    page = await getPublicPage(slug);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">
            Public Page
          </p>
          <h1 className="text-4xl font-bold">{page.title}</h1>
        </div>

        <PublicPageRenderer content={page.content} />
      </div>
    </main>
  );
}