import { CategoryCard } from "./CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface CategoryContentProps {
  categoryInfo: {
    id: string;
    name: string;
    category_name: string;
  } | null;
  tools: Array<{
    id: string | number;
    name: string;
    description: string;
    icon?: string;
    by?: string;
    tags?: string[];
    url: string;
    isFavorite?: boolean;
    mcpName?: string;
    mcpBy?: string;
    github?: string;
    imageSrc?: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
  onPageChange: (page: number) => void;
}

export function CategoryContent({
  categoryInfo,
  tools,
  pagination,
  onPageChange,
}: CategoryContentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  if (!categoryInfo) {
    return (
      <div className="text-center py-10 text-gray-500">
        Select a category to view tools
      </div>
    );
  }
  const title = searchQuery
    ? `Search results for "${searchQuery}" (${pagination.totalItems} items)`
    : categoryInfo.category_name === "all"
    ? `All Servers (${pagination.totalItems} total)`
    : `${categoryInfo.name} (${pagination.totalItems} items)`;

  return (
    <div className="mb-8 pt-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tools.map((tool, key) => (
            <CategoryCard
              key={key}
              name={tool.name}
              description={tool.description}
              by={tool.by}
              tags={tool.tags}
              icon={tool.icon}
              url={tool.url}
              isFavorite={tool.isFavorite}
              mcpBy={tool.mcpBy}
              mcpName={tool.mcpName}
              github={tool.github}
              imageSrc={tool.imageSrc}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          {searchQuery
            ? `没有找到与 "${searchQuery}" 匹配的服务器`
            : "此分类中没有服务器"}
        </div>
      )}

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                onPageChange(Math.max(1, pagination.currentPage - 1))
              }
              disabled={pagination.currentPage <= 1}
              className={`p-2 rounded ${
                pagination.currentPage <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page number buttons */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                // Show page numbers near the current page
                const currentPage = pagination.currentPage;
                const totalPages = pagination.totalPages;

                let pageNum;
                if (totalPages <= 5) {
                  // If total pages is less than or equal to 5, show all page numbers
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Near the beginning
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      pageNum === pagination.currentPage
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={
                      pageNum === pagination.currentPage ? "page" : undefined
                    }
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() =>
                onPageChange(
                  Math.min(pagination.totalPages, pagination.currentPage + 1)
                )
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className={`p-2 rounded ${
                pagination.currentPage >= pagination.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
