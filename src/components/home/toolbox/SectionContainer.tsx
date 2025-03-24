"use client";

import Link from "next/link";
import { SectionData } from "./SectionList";
import { ToolCard } from "./ToolCard";
import { Pagination } from "./Pagination";
import { useState, useEffect } from "react";

interface SectionContainerProps {
  section: SectionData;
}

export function SectionContainer({ section }: SectionContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState(section.data);
  const itemsPerPage = 8; // 每页显示8个项目
  const totalPages = Math.ceil(section.data.length / itemsPerPage);

  // 当页码或数据变化时，更新分页数据
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(section.data.slice(startIndex, endIndex));
  }, [currentPage, section.data]);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    // window.scrollTo({
    //   top: document.getElementById(`section-${section.id}`)?.offsetTop || 0,
    //   behavior: "smooth",
    // });
  };

  return (
    <div id={`section-${section.id}`} className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{section.title}</h2>
          {section.count > 0 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {section.count}
            </span>
          )}
          <Link
            href={`/toolbox/${section.id}`}
            className="text-xs text-gray-500 hover:text-gray-700 ml-2"
          >
            查看全部
          </Link>
        </div>

        {/* 使用紧凑模式的分页组件 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            // compact={true}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedData.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
