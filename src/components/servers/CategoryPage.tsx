"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useMemoizedFn } from "ahooks";
import { CategorySidebar } from "./CategorySidebar";
import { CategorySkeleton } from "./CategorySkeleton";
import { CategoryContent } from "./CategoryContent";
import { CategoryContentSkeleton } from "./CategoryContentSkeleton";
import { HeroSection } from "./HeroSection";
import { useRouter, useSearchParams } from "next/navigation";
import { createServerClient } from "@/lib/supabase";

// 在组件外部创建单例supabase客户端
const supabase = createServerClient();

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
  categoryName?: string;
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

// Define a proper cache structure to fix typing issues
interface CacheItem {
  categories?: CategorySection[];
  categoryCounts?: Record<string, number>;
  totalCount?: number;
  tools?: Tool[];
  pagination?: Pagination;
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
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [categoryToolCounts, setCategoryToolCounts] = useState<
    Record<string, number>
  >({});

  // const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 滚动到内容区域的函数
  const scrollToContent = useMemoizedFn(() => {
    if (contentRef.current && typeof window !== "undefined") {
      const headerOffset = 80; // 调整这个值来控制滚动的偏移量
      const elementPosition = contentRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });

  // 直接从searchParams计算当前值，避免不必要的函数包装
  const currentCategoryName = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";

  // 确保activeSection始终与URL参数同步 - 移除activeSection依赖避免循环
  useEffect(() => {
    setActiveSection(currentCategoryName);
  }, [currentCategoryName]);

  // 获取所有分类数据和总数据量（合并为一个请求）
  useEffect(() => {
    const fetchCategoriesAndCounts = async () => {
      try {
        // 1. 获取所有分类
        const { data: a_mcp_category } = await supabase
          .from("a_mcp_category")
          .select("*");

        const categories = a_mcp_category || [];
        setCategorySections(categories);

        // 2. 在同一个批次中获取每个分类的数据总量
        if (categories.length > 0) {
          const counts: Record<string, number> = {};
          let totalCount = 0;

          // 使用Promise.all并行获取所有分类的数据量
          const countPromises = categories.map(async (category) => {
            const tableName = `a_mcp_${category.category_name.replace(
              /-/g,
              "_"
            )}`;
            const { count, error } = await supabase
              .from(tableName)
              .select("*", { count: "exact", head: true });

            if (!error && count !== null) {
              counts[category.category_name] = count;
              totalCount += count;
            }
            return { category: category.category_name, count: count || 0 };
          });

          await Promise.all(countPromises);

          setCategoryToolCounts(counts);
          setTotalItemsCount(totalCount);
        } else {
          // 如果没有分类数据，确保设置加载状态为false
          setIsLoading(false);
        }
      } catch (error) {
        console.error("获取分类数据失败:", error);
        setIsLoading(false);
      }
    };

    fetchCategoriesAndCounts();
  }, []);

  // 优化的所有分类数据获取函数
  const fetchAllCategoryData = useMemoizedFn(
    async (
      page: number,
      itemsPerPage: number,
      searchQuery: string,
      categories: CategorySection[],
      totalCount: number
    ) => {
      let allTools: Tool[] = [];
      const categoriesToFetch = categories;
      const itemsPerCategory = 2; // 每个分类获取2条数据

      try {
        // 计算每个分类要获取的起始位置
        const pageOffset = (page - 1) * itemsPerCategory;
        let totalSearchResults = 0;

        // 使用Promise.all并行获取所有分类的数据
        const toolPromises = categoriesToFetch.map(async (category) => {
          try {
            const tableName = `a_mcp_${category.category_name.replace(
              /-/g,
              "_"
            )}`;

            // 构建查询
            let query = supabase.from(tableName).select("*");

            // 如果有搜索词，添加搜索条件
            if (searchQuery) {
              query = query.ilike("mcpName", `%${searchQuery}%`);

              // Get total count with separate query
              const { count } = await supabase
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .ilike("mcpName", `%${searchQuery}%`);
              totalSearchResults += count || 0;
            }

            // 应用分页
            const { data: categoryItems } = await query.range(
              pageOffset,
              pageOffset + itemsPerCategory - 1
            );

            if (categoryItems && categoryItems.length > 0) {
              // 处理数据并添加分类信息
              return categoryItems.map((item: CategoryItemData) => ({
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
                categoryName: category.name,
              }));
            }
            return [];
          } catch (error) {
            console.error(`获取分类 ${category.name} 数据失败:`, error);
            return [];
          }
        });

        const toolsArrays = await Promise.all(toolPromises);
        allTools = toolsArrays.flat();

        // 设置分页信息
        const pagination = {
          currentPage: page,
          totalPages: searchQuery
            ? Math.max(
                1,
                Math.ceil(
                  totalSearchResults /
                    (itemsPerCategory * categoriesToFetch.length)
                )
              )
            : Math.ceil(
                totalCount / (itemsPerCategory * categoriesToFetch.length)
              ),
          itemsPerPage: itemsPerCategory * categoriesToFetch.length,
          totalItems: searchQuery ? totalSearchResults : totalCount,
        };

        return { tools: allTools, pagination };
      } catch (error) {
        console.error("获取所有分类数据失败:", error);
        return {
          tools: [],
          pagination: {
            currentPage: page,
            totalPages: 1,
            itemsPerPage,
            totalItems: 0,
          },
        };
      }
    }
  );

  const fetchCategoryTools = useMemoizedFn(
    async (
      categoryName: string,
      page: number,
      searchQuery: string,
      categories: CategorySection[],
      toolCounts: Record<string, number>,
      totalCount: number
    ) => {
      if (categories.length === 0) {
        setIsLoading(false);
        setIsContentLoading(false);
        return;
      }

      setIsContentLoading(true);
      try {
        const itemsPerPage = 10; // 每页显示10条数据

        if (categoryName === "all") {
          // 使用封装的函数获取所有分类数据
          const result = await fetchAllCategoryData(
            page,
            itemsPerPage,
            searchQuery,
            categories,
            totalCount
          );
          setCurrentCategoryTools(result.tools);
          setCurrentPagination(result.pagination);
          setIsContentLoading(false);
          setIsLoading(false);
          return;
        }

        // 找到当前分类的信息
        const currentCategoryInfo = categories.find(
          (section) =>
            section.category_name === categoryName ||
            section.id === categoryName
        );

        if (!currentCategoryInfo) {
          setCurrentCategoryTools([]);
          setCurrentPagination({
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 10,
            totalItems: 0,
          });
          setIsContentLoading(false);
          setIsLoading(false);
          return;
        }

        const tableName = `a_mcp_${currentCategoryInfo.category_name.replace(
          /-/g,
          "_"
        )}`;

        // 在一个批次中获取数据量和页面数据
        const query = supabase.from(tableName);

        // 计算分页偏移量
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // 构建查询条件
        let dataQuery = query.select("*");
        if (searchQuery) {
          dataQuery = dataQuery.ilike("mcpName", `%${searchQuery}%`);
        }

        // 并行执行计数查询和数据查询
        const [countResult, dataResult] = await Promise.all([
          // 只在需要时获取总数
          searchQuery || !toolCounts[currentCategoryInfo.category_name]
            ? supabase
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .ilike("mcpName", searchQuery ? `%${searchQuery}%` : "%%")
            : Promise.resolve({
                count: toolCounts[currentCategoryInfo.category_name] || 0,
              }),

          // 获取实际数据
          dataQuery.range(from, to),
        ]);

        const totalItems = countResult.count || 0;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // 设置分页信息
        const pagination = {
          currentPage: page,
          totalPages,
          itemsPerPage,
          totalItems,
        };

        setCurrentPagination(pagination);

        // 处理获取的数据
        if (dataResult.data && dataResult.data.length > 0) {
          // 将API返回的数据转换为Tool类型
          const processedTools = dataResult.data.map(
            (item: CategoryItemData) => {
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
            }
          );

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
    }
  );
  // 优化的获取当前分类工具数据 - 简化依赖，避免过度执行
  useEffect(() => {
    if (categorySections.length > 0) {
      fetchCategoryTools(
        currentCategoryName,
        currentPage,
        currentSearch,
        categorySections,
        categoryToolCounts,
        totalItemsCount
      );
    }
  }, [
    fetchCategoryTools,
    currentCategoryName,
    currentPage,
    currentSearch,
    categorySections,
    categoryToolCounts,
    totalItemsCount,
  ]);

  // 处理分类点击
  const handleCategoryClick = useMemoizedFn((categoryName: string) => {
    if (categoryName === activeSection) return; // 避免重复点击

    setActiveSection(categoryName);

    // 获取当前搜索词（如果有）
    const searchParam = currentSearch
      ? `&search=${encodeURIComponent(currentSearch)}`
      : "";

    // 更新URL参数，重置页码到1
    router.push(`/mcp-servers?category=${categoryName}&page=1${searchParam}`);

    // 滚动到内容区域
    setTimeout(() => {
      scrollToContent();
    }, 500); // 短暂延迟确保状态更新完成
  });

  // 处理分页变化
  const handlePageChange = useMemoizedFn((page: number) => {
    // 获取当前搜索词（如果有）
    const searchParam = currentSearch
      ? `&search=${encodeURIComponent(currentSearch)}`
      : "";

    // 更新URL，保持当前分类但更改页码
    router.push(
      `/mcp-servers?category=${currentCategoryName}&page=${page}${searchParam}`
    );
  });

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
      <HeroSection
        categoryCount={categorySections.length}
        totalItemsCount={totalItemsCount}
      />

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
