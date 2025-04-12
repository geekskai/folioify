"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryToolList } from "./CategoryToolList";
// import { CategoryHeader } from "./CategoryHeader";
import { CategorySkeleton } from "./CategorySkeleton";
import { HeroSection } from "./HeroSection";
import { FeaturedSection } from "./FeaturedSection";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/db/supabase/client";
import { CategoryCard } from "./CategoryCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPageProps {
  category: string;
}

interface CategorySection {
  id: string;
  name: string;
  category_name: string;
  // tools?: any[];
}

interface Tool {
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
}

// 定义从API返回的数据结构
interface CategoryItemData {
  id: string | number;
  description?: string;
  mcpName?: string;
  mcpBy?: string;
  github?: string;
  imageSrc?: string;
  tags?: string[];
  url?: string;
  name?: string;
  by?: string;
  // [key: string]: any; // 允许其他未知字段
}

// 定义页码接口
interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(category);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );
  const [currentCategoryTools, setCurrentCategoryTools] = useState<Tool[]>([]);
  const [currentPagination, setCurrentPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 30,
    totalItems: 0,
  });

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 获取当前页码
  const getCurrentPage = useCallback(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  }, [searchParams]);

  // 获取当前分类
  const getCurrentCategory = useCallback(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam || category;
  }, [searchParams, category]);

  // 确保activeSection始终与URL参数同步
  useEffect(() => {
    const currentCategory = getCurrentCategory();
    if (currentCategory !== activeSection) {
      setActiveSection(currentCategory);
      initialScrollDone.current = false; // 重置滚动状态，允许重新滚动
    }
  }, [getCurrentCategory, activeSection]);

  // 获取所有分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: a_mcp_category } = await supabase
          .from("a_mcp_category")
          .select("*");

        const categories = a_mcp_category || [];
        setCategorySections(categories);
      } catch (error) {
        console.error("获取分类数据失败:", error);
      }
    };

    fetchCategories();
  }, []);

  // 获取当前分类的工具数据
  useEffect(() => {
    const fetchCategoryTools = async () => {
      setIsLoading(true);
      try {
        const currentCategoryName = getCurrentCategory();
        const currentPage = getCurrentPage();
        const itemsPerPage = 30; // 每页显示30条数据

        // 找到当前分类的信息
        const currentCategoryInfo = categorySections.find(
          (section) =>
            section.category_name === currentCategoryName ||
            section.id === currentCategoryName
        );

        if (!currentCategoryInfo) {
          setCurrentCategoryTools([]);
          setCurrentPagination({
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 30,
            totalItems: 0,
          });
          setIsLoading(false);
          return;
        }

        // 获取数据总数
        const { count } = await supabase
          .from(`a_mcp_${currentCategoryInfo.category_name.replace(/-/g, "_")}`)
          .select("*", { count: "exact", head: true });

        const totalItems = count || 0;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // 设置分页信息
        setCurrentPagination({
          currentPage,
          totalPages,
          itemsPerPage,
          totalItems,
        });

        // 计算分页偏移量
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // 获取当前分类下的工具
        const { data: categoryItems } = await supabase
          .from(`a_mcp_${currentCategoryInfo.category_name.replace(/-/g, "_")}`)
          .select("*")
          .range(from, to);

        console.log(
          `🚀 ~ categoryItems for ${currentCategoryInfo.name}:`,
          categoryItems
        );

        // 处理获取的数据
        if (categoryItems && categoryItems.length > 0) {
          // 将API返回的数据转换为Tool类型
          const processedTools = categoryItems.map((item: CategoryItemData) => {
            const tool: Tool = {
              id:
                item.id ||
                `tool-${currentCategoryInfo.id}-${
                  item.mcpName?.toLowerCase().replace(/\s+/g, "-") || ""
                }`,
              name: item.mcpName || item.name || `Tool ${item.id}`,
              description: item.description || "No description available",
              by: item.mcpBy || item.by,
              tags: item.tags || [
                currentCategoryInfo.category_name.replace("-", " "),
              ],
              url: item.url || item.github || `/tools/${item.id}`,
              icon: item.imageSrc || "/placeholder-icon.png",
              isFavorite: false,
              mcpName: item.mcpName,
              mcpBy: item.mcpBy,
              github: item.github,
              imageSrc: item.imageSrc,
            };
            return tool;
          });

          setCurrentCategoryTools(processedTools);
        } else {
          // 如果没有数据，设置为空数组
          setCurrentCategoryTools([]);
        }
      } catch (error) {
        console.error("获取分类工具数据失败:", error);
        setCurrentCategoryTools([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySections.length > 0) {
      fetchCategoryTools();
    }
  }, [searchParams, categorySections, getCurrentCategory, getCurrentPage]);

  // 初始化滚动到指定分类
  useEffect(() => {
    if (
      !isLoading &&
      !initialScrollDone.current &&
      categorySections.length > 0
    ) {
      // 等待DOM更新完成后再滚动
      setTimeout(() => {
        const element = sectionRefs.current[category];
        if (element) {
          // 使用更平滑的滚动
          const headerOffset = 80; // 调整这个值来控制滚动的偏移量
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          initialScrollDone.current = true;
        }
      }, 300); // 增加延迟，确保DOM已完全渲染
    }
  }, [isLoading, category, categorySections]);

  // 处理分类点击
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      console.log("Navigating to category:", categoryName);

      if (categoryName === activeSection) return; // 避免重复点击

      setActiveSection(categoryName);

      // 更新URL参数，重置页码到1
      router.push(`/mcp-servers?category=${categoryName}&page=1`);
    },
    [activeSection, router]
  );

  // 处理分页变化
  const handlePageChange = useCallback(
    (page: number) => {
      // 获取当前分类
      const currentCategoryName = getCurrentCategory();

      // 更新URL，保持当前分类但更改页码
      router.push(`/mcp-servers?category=${currentCategoryName}&page=${page}`);
    },
    [getCurrentCategory, router]
  );

  // 获取当前分类信息
  const currentCategoryInfo = categorySections.find(
    (section) =>
      section.category_name === activeSection || section.id === activeSection
  );

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 添加Hero部分 */}
      <HeroSection categoryCount={categorySections.length} />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-4">
            <CategorySidebar
              activeCategory={activeSection}
              onCategoryClick={handleCategoryClick}
              categories={categorySections}
            />
          </div>
        </div>
        <div className="flex-1" ref={contentRef}>
          {/* 添加Featured部分 */}
          {/* <FeaturedSection tools={featuredTools} /> */}

          {currentCategoryInfo && (
            <div className="mb-8 pt-4">
              <h2 className="text-2xl font-bold mb-4">
                {currentCategoryInfo.name} ({currentPagination.totalItems})
              </h2>

              {currentCategoryTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {currentCategoryTools.map((tool) => (
                    <CategoryCard
                      key={tool.id}
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
                  No tools found for this category
                </div>
              )}

              {/* 分页控件 */}
              {currentPagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, currentPagination.currentPage - 1)
                        )
                      }
                      disabled={currentPagination.currentPage <= 1}
                      className={`p-2 rounded ${
                        currentPagination.currentPage <= 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* 页码按钮 */}
                    {Array.from(
                      { length: Math.min(5, currentPagination.totalPages) },
                      (_, i) => {
                        // 显示当前页附近的页码
                        const currentPage = currentPagination.currentPage;
                        const totalPages = currentPagination.totalPages;

                        let pageNum;
                        if (totalPages <= 5) {
                          // 如果总页数少于等于5，直接显示所有页码
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          // 靠近起始页
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // 靠近结束页
                          pageNum = totalPages - 4 + i;
                        } else {
                          // 中间页
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded ${
                              pageNum === currentPagination.currentPage
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-100"
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={
                              pageNum === currentPagination.currentPage
                                ? "page"
                                : undefined
                            }
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            currentPagination.totalPages,
                            currentPagination.currentPage + 1
                          )
                        )
                      }
                      disabled={
                        currentPagination.currentPage >=
                        currentPagination.totalPages
                      }
                      className={`p-2 rounded ${
                        currentPagination.currentPage >=
                        currentPagination.totalPages
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
          )}
        </div>
      </div>
    </div>
  );
}
