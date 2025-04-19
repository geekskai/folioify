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

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const dataCache = useRef<Record<string, CacheItem>>({});

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

  // 获取当前搜索关键词
  const getCurrentSearch = useCallback(() => {
    const searchParam = searchParams.get("search");
    return searchParam || "";
  }, [searchParams]);

  // 确保activeSection始终与URL参数同步
  useEffect(() => {
    const currentCategory = getCurrentCategory();
    if (currentCategory !== activeSection) {
      setActiveSection(currentCategory);
      initialScrollDone.current = false; // 重置滚动状态，允许重新滚动
    }
  }, [getCurrentCategory, activeSection]);

  // 获取所有分类数据和总数据量（合并为一个请求）
  useEffect(() => {
    const fetchCategoriesAndCounts = async () => {
      // 检查缓存
      if (dataCache.current.main?.categories) {
        setCategorySections(dataCache.current.main.categories);
        if (dataCache.current.main.categoryCounts) {
          setCategoryToolCounts(dataCache.current.main.categoryCounts);
        }
        if (dataCache.current.main.totalCount !== undefined) {
          setTotalItemsCount(dataCache.current.main.totalCount);
        }
        return;
      }

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

          // 缓存数据以避免重复请求
          dataCache.current.main = {
            categories,
            categoryCounts: counts,
            totalCount,
          };
        }
      } catch (error) {
        console.error("获取分类数据失败:", error);
      }
    };

    fetchCategoriesAndCounts();
  }, [supabase]);

  // 优化的所有分类数据获取函数
  const fetchAllCategoryData = useCallback(
    async (page: number, itemsPerPage: number) => {
      const searchQuery = getCurrentSearch();
      const cacheKey = `all_${page}_${itemsPerPage}_${searchQuery}`;

      // 检查缓存
      if (
        dataCache.current[cacheKey]?.tools &&
        dataCache.current[cacheKey]?.pagination
      ) {
        // 使用缓存数据
        setCurrentPagination(dataCache.current[cacheKey].pagination!);
        return dataCache.current[cacheKey].tools!;
      }

      let allTools: Tool[] = [];
      const categoriesToFetch = categorySections;
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
                totalItemsCount / (itemsPerCategory * categoriesToFetch.length)
              ),
          itemsPerPage: itemsPerCategory * categoriesToFetch.length,
          totalItems: searchQuery ? totalSearchResults : totalItemsCount,
        };

        setCurrentPagination(pagination);

        // 缓存结果
        dataCache.current[cacheKey] = {
          tools: allTools,
          pagination,
        };

        return allTools;
      } catch (error) {
        console.error("获取所有分类数据失败:", error);
        return [];
      }
    },
    [categorySections, supabase, totalItemsCount, getCurrentSearch]
  );

  // 优化的获取当前分类工具数据
  useEffect(() => {
    const fetchCategoryTools = async () => {
      if (categorySections.length === 0) return;

      setIsContentLoading(true);
      try {
        const currentCategoryName = getCurrentCategory();
        const currentPage = getCurrentPage();
        const searchQuery = getCurrentSearch();
        const itemsPerPage = 10; // 每页显示10条数据

        // 构建缓存键
        const cacheKey = `${currentCategoryName}_${currentPage}_${searchQuery}`;

        // 检查缓存
        if (
          dataCache.current[cacheKey]?.tools &&
          dataCache.current[cacheKey]?.pagination
        ) {
          setCurrentCategoryTools(dataCache.current[cacheKey].tools!);
          setCurrentPagination(dataCache.current[cacheKey].pagination!);
          setIsContentLoading(false);
          setIsLoading(false);
          return;
        }

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
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // 构建查询条件
        let dataQuery = query.select("*");
        if (searchQuery) {
          dataQuery = dataQuery.ilike("mcpName", `%${searchQuery}%`);
        }

        // 并行执行计数查询和数据查询
        const [countResult, dataResult] = await Promise.all([
          // 只在需要时获取总数
          searchQuery || !categoryToolCounts[currentCategoryInfo.category_name]
            ? supabase
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .ilike("mcpName", searchQuery ? `%${searchQuery}%` : "%%")
            : Promise.resolve({
                count:
                  categoryToolCounts[currentCategoryInfo.category_name] || 0,
              }),

          // 获取实际数据
          dataQuery.range(from, to),
        ]);

        const totalItems = countResult.count || 0;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // 设置分页信息
        const pagination = {
          currentPage,
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

          // 缓存结果
          dataCache.current[cacheKey] = {
            tools: processedTools,
            pagination,
          };
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

    fetchCategoryTools();
  }, [
    searchParams,
    categorySections,
    categoryToolCounts,
    supabase,
    getCurrentCategory,
    getCurrentPage,
    getCurrentSearch,
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
      if (categoryName === activeSection) return; // 避免重复点击

      setIsContentLoading(true);
      setActiveSection(categoryName);

      // 获取当前搜索词（如果有）
      const currentSearch = getCurrentSearch();
      const searchParam = currentSearch
        ? `&search=${encodeURIComponent(currentSearch)}`
        : "";

      // 更新URL参数，重置页码到1
      router.push(`/mcp-servers?category=${categoryName}&page=1${searchParam}`);
    },
    [activeSection, router, getCurrentSearch]
  );

  // 处理分页变化
  const handlePageChange = useCallback(
    (page: number) => {
      // 获取当前分类
      const currentCategoryName = getCurrentCategory();
      // 获取当前搜索词（如果有）
      const currentSearch = getCurrentSearch();
      const searchParam = currentSearch
        ? `&search=${encodeURIComponent(currentSearch)}`
        : "";

      setIsContentLoading(true);

      // 更新URL，保持当前分类但更改页码
      router.push(
        `/mcp-servers?category=${currentCategoryName}&page=${page}${searchParam}`
      );
    },
    [getCurrentCategory, getCurrentSearch, router]
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
