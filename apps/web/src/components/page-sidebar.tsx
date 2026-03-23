import type { Page } from "@/lib/types";

type PageSidebarProps = {
  pages: Page[];
  selectedPageId: number | null;
  isLoading: boolean;
  onCreatePage: () => Promise<void>;
  onSelectPage: (pageId: number) => Promise<void>;
};

export function PageSidebar({
  pages,
  selectedPageId,
  isLoading,
  onCreatePage,
  onSelectPage,
}: PageSidebarProps) {
  return (
    <aside className="flex w-72 flex-col border-r bg-gray-50">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Pages</h1>
        <button
          type="button"
          onClick={() => void onCreatePage()}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
        >
          New
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <p className="px-4 py-3 text-sm text-gray-500">Loading pages...</p>
        ) : pages.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500">No pages yet.</p>
        ) : (
          <ul className="py-2">
            {pages.map((page) => {
              const isSelected = page.id === selectedPageId;

              return (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => void onSelectPage(page.id)}
                    className={`w-full px-4 py-2 text-left text-sm ${
                      isSelected
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div>{page.title}</div>
                    {page.slug ? (
                      <div className="text-xs text-gray-500">{page.slug}</div>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}