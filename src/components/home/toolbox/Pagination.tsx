import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`p-1.5 rounded-md flex items-center justify-center ${
          currentPage <= 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="上一页"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        // 计算要显示的页码
        let pageNum;
        if (totalPages <= 5) {
          // 如果总页数小于等于5，直接显示1到totalPages
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          // 如果当前页在前3页，显示1到5
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          // 如果当前页在后3页，显示最后5页
          pageNum = totalPages - 4 + i;
        } else {
          // 否则显示当前页及其前后2页
          pageNum = currentPage - 2 + i;
        }

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              currentPage === pageNum
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage >= totalPages}
        className={`p-1.5 rounded-md flex items-center justify-center ${
          currentPage >= totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="下一页"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
