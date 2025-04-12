"use client";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { CategorySkeleton } from "./CategorySkeleton";
import { CategoryContent } from "./CategoryContent";
import { CategoryContentSkeleton } from "./CategoryContentSkeleton";
import { HeroSection } from "./HeroSection";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/db/supabase/client";

interface CategoryPageProps {
  category: string;
}

interface CategorySection {
  id: string;
  name: string;
  category_name: string;
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
  const [currentCategoryTools, setCurrentCategoryTools] = useState<Tool[]>([]);
  const [currentPagination, setCurrentPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 30,
    totalItems: 0,
  });
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

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
    return categoryParam || "all"; // 默认为"all"而不是category
  }, [searchParams]);

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
  }, [supabase]);

  // 获取所有表的总数量
  useEffect(() => {
    const fetchTotalCounts = async () => {
      if (categorySections.length === 0) return;

      try {
        let totalCount = 0;

        // 遍历所有分类，获取每个分类的数据总数
        for (const category of categorySections) {
          const tableName = `a_mcp_${category.category_name.replace(
            /-/g,
            "_"
          )}`;

          // 使用count查询获取表中的条目数
          const { count, error } = await supabase
            .from(tableName)
            .select("*", { count: "exact", head: true });

          if (error) {
            console.error(`获取表 ${tableName} 数据总数失败:`, error);
            continue;
          }

          totalCount += count || 0;
        }

        setTotalItemsCount(totalCount);
      } catch (error) {
        console.error("获取所有表总数据量失败:", error);
      }
    };

    fetchTotalCounts();
  }, [categorySections, supabase]);

  // 处理"all"分类情况的逻辑
  const fetchAllCategoryData = useCallback(
    async (page: number, itemsPerPage: number) => {
      let allTools: Tool[] = [];
      const categoriesToFetch = categorySections;
      const itemsPerCategory = 10; // 每个分类获取10条数据

      try {
        // 计算每个分类要获取的起始位置
        const pageOffset = (page - 1) * itemsPerCategory;

        // 为每个分类获取数据
        for (const category of categoriesToFetch) {
          try {
            const tableName = `a_mcp_${category.category_name.replace(
              /-/g,
              "_"
            )}`;

            // 获取每个分类的数据，基于分页偏移
            const { data: categoryItems } = await supabase
              .from(tableName)
              .select("*")
              .range(pageOffset, pageOffset + itemsPerCategory - 1); // 每页获取指定数量条数据

            if (categoryItems && categoryItems.length > 0) {
              // 处理数据并添加分类信息
              const processedTools = categoryItems.map(
                (item: CategoryItemData) => ({
                  id:
                    item.id ||
                    `tool-${category.id}-${
                      item.mcpName?.toLowerCase().replace(/\s+/g, "-") || ""
                    }`,
                  name: item.mcpName || item.name || `Tool ${item.id}`,
                  description: item.description || "No description available",
                  by: item.mcpBy || item.by,
                  tags: [
                    ...(item.tags || []),
                    category.category_name.replace(/-/g, " "),
                  ],
                  url: item.url || item.github || `/tools/${item.id}`,
                  icon: item.imageSrc || "/placeholder-icon.png",
                  isFavorite: false,
                  mcpName: item.mcpName,
                  mcpBy: item.mcpBy,
                  github: item.github,
                  imageSrc: item.imageSrc,
                  categoryName: category.name, // 添加分类名称，方便前端展示
                })
              );

              allTools = [...allTools, ...processedTools];
            }
          } catch (error) {
            console.error(`获取分类 ${category.name} 数据失败:`, error);
          }
        }

        // 设置分页信息
        setCurrentPagination({
          currentPage: page,
          totalPages: Math.ceil(
            totalItemsCount / (itemsPerCategory * categoriesToFetch.length)
          ),
          itemsPerPage: itemsPerCategory * categoriesToFetch.length,
          totalItems: totalItemsCount,
        });

        return allTools;
      } catch (error) {
        console.error("获取所有分类数据失败:", error);
        return [];
      }
    },
    [categorySections, supabase, totalItemsCount]
  );

  // 获取当前分类的工具数据
  useEffect(() => {
    const fetchCategoryTools = async () => {
      setIsContentLoading(true);
      try {
        const currentCategoryName = getCurrentCategory();
        const currentPage = getCurrentPage();
        const itemsPerPage = 30; // 每页显示30条数据

        if (currentCategoryName === "all") {
          // 使用封装的函数获取所有分类数据
          const allTools = await fetchAllCategoryData(
            currentPage,
            itemsPerPage
          );
          setCurrentCategoryTools(allTools);
          setIsContentLoading(false);
          setIsLoading(false);
          return;
        }

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
          setIsContentLoading(false);
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
        setIsContentLoading(false);
        setIsLoading(false);
      }
    };

    if (categorySections.length > 0) {
      fetchCategoryTools();
    }
  }, [
    searchParams,
    categorySections,
    supabase,
    getCurrentCategory,
    getCurrentPage,
    fetchAllCategoryData,
  ]);

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

      setIsContentLoading(true);
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
      setIsContentLoading(true);

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

  // 创建一个虚拟的"全部"分类
  const allCategoryInfo =
    activeSection === "all"
      ? {
          id: "all",
          name: `All Servers`,
          category_name: "all",
        }
      : null;

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
              categories={[
                { id: "all", name: "All Servers", category_name: "all" },
                ...categorySections,
              ]}
            />
          </div>
        </div>
        <div className="flex-1" ref={contentRef}>
          <Suspense fallback={<CategoryContentSkeleton />}>
            {isContentLoading ? (
              <CategoryContentSkeleton />
            ) : (
              <>
                {/* {activeSection === "all" && featuredTools.length > 0 && (
                    <FeaturedSection tools={featuredTools} />
                  )} */}
                <CategoryContent
                  categoryInfo={
                    activeSection === "all"
                      ? allCategoryInfo
                      : currentCategoryInfo || null
                  }
                  tools={currentCategoryTools}
                  pagination={currentPagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
