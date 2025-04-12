"use client";

import { useEffect, useState, useRef } from "react";
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
  const [categoryTools, setCategoryTools] = useState<Record<string, Tool[]>>(
    {}
  );
  const [pagination, setPagination] = useState<Record<string, Pagination>>({});

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 获取当前页码
  const getCurrentPage = () => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  // 确保activeSection始终与URL参数同步
  useEffect(() => {
    if (category !== activeSection) {
      setActiveSection(category);
      initialScrollDone.current = false; // 重置滚动状态，允许重新滚动
    }
  }, [category, activeSection]);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data: a_mcp_category } = await supabase
          .from("a_mcp_category")
          .select("*");

        const categories = a_mcp_category || [];

        console.log(`🚀 ~ a_mcp_category:`, a_mcp_category);
        setCategorySections(categories);

        // 获取分类下的工具
        if (categories && categories.length > 0) {
          const toolsData: Record<string, Tool[]> = {};
          const paginationData: Record<string, Pagination> = {};

          // 从URL获取当前页码
          const currentPage = getCurrentPage();
          const itemsPerPage = 30; // 每页显示30条数据

          // 这里可以根据实际需求修改为批量获取或者按需获取
          for (const category of categories) {
            // 获取数据总数
            const { count } = await supabase
              .from(`a_mcp_${category.category_name.replace(/-/g, "_")}`)
              .select("*", { count: "exact", head: true });

            const totalItems = count || 0;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // 设置分页信息
            paginationData[category.id] = {
              currentPage,
              totalPages,
              itemsPerPage,
              totalItems,
            };

            // 计算分页偏移量
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            // 这里假设有一个关联表存储每个分类下的工具
            // 替换为实际的数据获取逻辑
            const { data: categoryItems } = await supabase
              .from(`a_mcp_${category.category_name.replace(/-/g, "_")}`)
              .select("*")
              .range(from, to);

            console.log(`🚀 ~ categoryItems:`, categoryItems);

            // 处理获取的数据
            if (categoryItems && categoryItems.length > 0) {
              // 将API返回的数据转换为Tool类型
              const processedTools = categoryItems.map(
                (item: CategoryItemData) => {
                  const tool: Tool = {
                    id:
                      item.id ||
                      `tool-${category.id}-${
                        item.mcpName?.toLowerCase().replace(/\s+/g, "-") || ""
                      }`,
                    name: item.mcpName || item.name || `Tool ${item.id}`,
                    description: item.description || "No description available",
                    by: item.mcpBy || item.by,
                    tags: item.tags || [
                      category.category_name.replace("-", " "),
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
                }
              );

              toolsData[category.id] = processedTools;
            } else {
              // 如果没有数据，设置为空数组
              toolsData[category.id] = [];
            }
          }

          setCategoryTools(toolsData);
          setPagination(paginationData);
        }
      } catch (error) {
        console.error("获取分类数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [searchParams]); // 添加searchParams依赖，当URL参数变化时重新获取数据

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

  // 监听滚动事件，更新当前活动的分类
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || categorySections.length === 0) return;

      const scrollPosition = window.scrollY + 100; // 添加一些偏移量
      const contentTop = contentRef.current.offsetTop;

      // 找到当前在视图中的分类
      let foundActive = false;

      // 按照DOM顺序检查元素，确保选择最上面的可见元素
      for (const section of categorySections) {
        const element = sectionRefs.current[section.id];
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;

        if (
          scrollPosition >= offsetTop - 50 &&
          scrollPosition < offsetTop + offsetHeight - 50
        ) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
            // 不更新URL，避免循环
          }
          foundActive = true;
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categorySections, activeSection]);

  // 处理导航点击
  const handleNavClick = (sectionId: string) => {
    console.log("Navigating to section:", sectionId);

    if (sectionId === activeSection) return; // 避免重复点击

    setActiveSection(sectionId);

    // 更新URL参数
    router.push(`/mcp-servers?category=${sectionId}`, { scroll: false });

    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 80; // 调整这个值来控制滚动的偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 处理分页变化
  const handlePageChange = (categoryId: string, page: number) => {
    // 构建URL查询参数
    const currentCategory = categorySections.find(
      (section) => section.id === categoryId
    );
    if (!currentCategory) return;

    // 更新URL
    router.push(
      `/mcp-servers?category=${currentCategory.category_name}&page=${page}`
    );
  };

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
              onCategoryClick={handleNavClick}
              categories={categorySections}
            />
          </div>
        </div>
        <div className="flex-1" ref={contentRef}>
          {/* 添加Featured部分 */}
          {/* <FeaturedSection tools={featuredTools} /> */}

          {categorySections.map((section) => (
            <div
              key={section.category_name}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[section.id] = el;
                return undefined;
              }}
              id={`section-${section.id}`}
              className="mb-8 pt-4" // 减小底部间距，添加顶部内边距用于滚动定位
            >
              <h2 className="text-2xl font-bold mb-4">
                {section.name} ({pagination[section.id]?.totalItems || 0})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categoryTools[section.id]?.map((tool) => (
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

              {/* 分页控件 */}
              {pagination[section.id] &&
                pagination[section.id].totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 mb-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(
                            section.id,
                            Math.max(1, pagination[section.id].currentPage - 1)
                          )
                        }
                        disabled={pagination[section.id].currentPage <= 1}
                        className={`p-2 rounded ${
                          pagination[section.id].currentPage <= 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* 页码按钮 */}
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            pagination[section.id].totalPages
                          ),
                        },
                        (_, i) => {
                          // 显示当前页附近的页码
                          const currentPage =
                            pagination[section.id].currentPage;
                          const totalPages = pagination[section.id].totalPages;

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
                              onClick={() =>
                                handlePageChange(section.id, pageNum)
                              }
                              className={`w-8 h-8 flex items-center justify-center rounded ${
                                pageNum === pagination[section.id].currentPage
                                  ? "bg-blue-500 text-white"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          handlePageChange(
                            section.id,
                            Math.min(
                              pagination[section.id].totalPages,
                              pagination[section.id].currentPage + 1
                            )
                          )
                        }
                        disabled={
                          pagination[section.id].currentPage >=
                          pagination[section.id].totalPages
                        }
                        className={`p-2 rounded ${
                          pagination[section.id].currentPage >=
                          pagination[section.id].totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
