"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryToolList } from "./CategoryToolList";
// import { CategoryHeader } from "./CategoryHeader";
import { CategorySkeleton } from "./CategorySkeleton";
import { ContentSkeleton } from "./ContentSkeleton";
import { HeroSection } from "./HeroSection";
import { FeaturedSection } from "./FeaturedSection";
import { useRouter } from "next/navigation";
import { createServerClient } from "@/lib/supabase";

interface CategoryPageProps {
  group: string;
}

interface CategorySection {
  id: string;
  name: string;
  tools: Array<{
    id: number;
    name: string;
    count: number;
    handle?: string;
  }>;
}

export function CategoryPage({ group }: CategoryPageProps) {
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(group);
  const [allCategorySections, setAllCategorySections] = useState<
    CategorySection[]
  >([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const dataFetched = useRef(false);

  // 使用useMemo来计算当前应该显示的分类数据，基于activeSection
  // 这样就不需要重新从API获取数据，只需要从已有数据中筛选显示
  const categorySections = useMemo(() => {
    if (allCategorySections.length === 0) return [];
    return sortSectionsByGroup([...allCategorySections], activeSection);
  }, [allCategorySections, activeSection]);

  // 确保activeSection始终与URL参数同步
  useEffect(() => {
    if (group !== activeSection) {
      setActiveSection(group);
      initialScrollDone.current = false; // 重置滚动状态，允许重新滚动

      // 仅当有数据时才进行切换动画，首次加载不需要
      if (allCategorySections.length > 0) {
        setIsContentLoading(true);
        // 使用setTimeout模拟切换的短暂延迟，提供更好的视觉反馈
        setTimeout(() => {
          setIsContentLoading(false);
        }, 300); // 较短的延迟，让用户感觉到切换但不会太长
      }
    }
  }, [group, activeSection, allCategorySections.length]);

  // 只在组件首次挂载时获取所有分类数据
  useEffect(() => {
    // 如果已经获取过数据，不再重复获取
    if (dataFetched.current) return;

    const fetchAllCategoryData = async () => {
      setIsInitialLoading(true);

      try {
        // Import the client dynamically to avoid SSR issues
        // const { createClient } = await import("@/lib/supabase");
        const supabase = createServerClient();

        // Fetch category groups
        const { data: groups, error: groupsError } = await supabase
          .from("category_groups")
          .select("id, title, name, handle")
          .order("id");

        if (groupsError) {
          console.error("Error fetching category groups:", groupsError);
          // Fallback to static data
          setAllCategorySections(generateCategorySections());
          return;
        }

        if (!groups || groups.length === 0) {
          console.warn("No category groups found in database");
          // Fallback to static data
          setAllCategorySections(generateCategorySections());
          return;
        }

        // Get total category count from Supabase
        const { data: countData, error: countError } = await supabase
          .from("category_values")
          .select("id", { count: "exact" });

        if (!countError && countData) {
          setCategoryCount(countData.length);
        }

        // 获取所有分类组的工具数据
        const allPromises = groups.map(async (group) => {
          // Fetch category values for this group
          const { data: values, error: valuesError } = await supabase
            .from("category_values")
            .select("id, name, tool_count, handle")
            .eq("group_id", group.id)
            .order("tool_count", { ascending: false });

          if (valuesError) {
            console.error(
              `Error fetching values for group ${group.handle}:`,
              valuesError
            );
            return null;
          }

          if (!values || values.length === 0) {
            console.warn(`No values found for group ${group.handle}`);
            return null;
          }

          // Map values to tools format
          const tools = values.map((value) => ({
            id: value.id,
            name: value.name,
            count: value.tool_count,
            handle: value.handle,
          }));

          // Return section data
          return {
            id: group.handle,
            name: group.title || group.name,
            tools,
          };
        });

        // 等待所有数据并过滤掉失败的请求
        const results = await Promise.all(allPromises);
        const validSections = results
          .filter((section) => section !== null)
          .map((section) => section as CategorySection);

        console.log(
          `🚀 ~ fetchAllCategoryData ~ validSections:`,
          validSections
        );
        // 存储所有分类数据
        setAllCategorySections(validSections);
        dataFetched.current = true;
      } catch (error) {
        console.error("Error fetching category data:", error);
        // Fallback to static data
        setAllCategorySections(generateCategorySections());
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchAllCategoryData();
  }, []); // 空依赖数组确保只执行一次

  // 初始化滚动到指定分类
  useEffect(() => {
    if (
      !isInitialLoading &&
      !isContentLoading &&
      !initialScrollDone.current &&
      categorySections.length > 0
    ) {
      // 等待DOM更新完成后再滚动
      setTimeout(() => {
        const element = sectionRefs.current[activeSection];

        const isClient = typeof window !== "undefined";
        if (element && isClient) {
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
  }, [isInitialLoading, isContentLoading, categorySections, activeSection]);

  // 处理导航点击
  const handleNavClick = (sectionId: string) => {
    console.log("Navigating to section:", sectionId);

    if (sectionId === activeSection) return; // 避免重复点击

    setActiveSection(sectionId);

    // 当用户点击导航时，显示短暂的加载状态
    setIsContentLoading(true);

    // 更新URL参数
    router.push(`/category?group=${sectionId}`, { scroll: false });

    // 短暂延迟后关闭加载状态，给用户一个视觉反馈
    setTimeout(() => {
      setIsContentLoading(false);

      // 滚动到对应位置
      const element = sectionRefs.current[sectionId];
      const isClient = typeof window !== "undefined";
      if (element && isClient) {
        const headerOffset = 80; // 调整这个值来控制滚动的偏移量
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  // 整页初始加载状态
  if (isInitialLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <HeroSection categoryCount={categoryCount || 233} />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar - 总是可见的 */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-20">
            <CategorySidebar
              activeCategory={activeSection}
              onCategoryClick={handleNavClick}
              categories={allCategorySections}
            />
          </div>
        </div>

        {/* Main Content - 加载时显示骨架屏 */}
        {isContentLoading ? (
          <ContentSkeleton />
        ) : (
          <div className="flex-1" ref={contentRef}>
            {categorySections.map((section) => (
              <div
                key={section.id}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[section.id] = el;
                  return undefined;
                }}
                id={`section-${section.id}`}
                className="mb-12 pt-2"
              >
                <h2 className="text-2xl font-bold mb-6">{section.name}</h2>
                <CategoryToolList tools={section.tools} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 根据当前分类组排序分类部分
function sortSectionsByGroup(
  sections: CategorySection[],
  currentGroup: string
): CategorySection[] {
  return [...sections].sort((a, b) => {
    if (a.id === currentGroup) return -1;
    if (b.id === currentGroup) return 1;
    return 0;
  });
}

// 生成所有分类数据
function generateCategorySections(): CategorySection[] {
  const categories = [
    { id: "text-writing", name: "Text&Writing" },
    { id: "image", name: "Image" },
    { id: "video", name: "Video" },
    { id: "code-it", name: "Code&IT" },
    { id: "voice", name: "Voice" },
    { id: "business", name: "Business" },
    { id: "marketing", name: "Marketing" },
    { id: "ai-detector", name: "AI Detector" },
    { id: "chatbot", name: "Chatbot" },
    { id: "design-art", name: "Design&Art" },
    { id: "life-assistant", name: "Life Assistant" },
    { id: "3d", name: "3D" },
    { id: "education", name: "Education" },
    { id: "prompt", name: "Prompt" },
    { id: "productivity", name: "Productivity" },
    { id: "other", name: "Other" },
  ];

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    tools: generateToolsForCategory(category.id),
  }));
}

// 模拟生成分类工具数据
function generateToolsForCategory(group: string) {
  if (group === "text-writing") {
    return [
      { id: 1, name: "AI Blog Writer", count: 537 },
      { id: 2, name: "Translate", count: 595 },
      { id: 3, name: "Papers", count: 269 },
      { id: 4, name: "Handwriting", count: 59 },
      { id: 5, name: "Copywriting", count: 921 },
      { id: 6, name: "Captions or Subtitle", count: 490 },
      { id: 7, name: "Essay Writer", count: 310 },
      { id: 8, name: "Letter Writer", count: 182 },
      { id: 9, name: "AI Lyrics Generator", count: 106 },
      { id: 10, name: "Report Writing", count: 297 },
      { id: 11, name: "AI Rewriter", count: 684 },
      { id: 12, name: "AI Script Writing", count: 251 },
      { id: 13, name: "AI Story Writing", count: 484 },
      { id: 14, name: "AI Bio Generator", count: 149 },
      { id: 15, name: "AI Book Writing", count: 243 },
      { id: 16, name: "Paraphraser", count: 584 },
      { id: 17, name: "AI Poem & Poetry Generator", count: 71 },
      { id: 18, name: "Summarizer", count: 1214 },
      { id: 19, name: "Pick-up Lines Generator", count: 45 },
      { id: 20, name: "Transcription", count: 605 },
    ];
  } else if (group === "image") {
    return [
      { id: 21, name: "Text to Image", count: 815 },
      { id: 22, name: "AI Photo & Image Generator", count: 2013 },
      { id: 23, name: "AI Illustration Generator", count: 499 },
      { id: 24, name: "AI Avatar Generator", count: 418 },
      { id: 25, name: "AI Background Generator", count: 347 },
      { id: 26, name: "AI Banner Generator", count: 273 },
    ];
  }

  // 为其他分类生成一些示例数据
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 100,
    name: `${getCategoryName(group)} Tool ${i + 1}`,
    count: Math.floor(Math.random() * 1000),
  }));
}

// 辅助函数，根据分类ID获取分类名称
function getCategoryName(group: string): string {
  const categoryMap: Record<string, string> = {
    "text-writing": "Text&Writing",
    image: "Image",
    video: "Video",
    "code-it": "Code&IT",
    voice: "Voice",
    business: "Business",
    marketing: "Marketing",
    "ai-detector": "AI Detector",
    chatbot: "Chatbot",
    "design-art": "Design&Art",
    "life-assistant": "Life Assistant",
    "3d": "3D",
    education: "Education",
    prompt: "Prompt",
    productivity: "Productivity",
    other: "Other",
  };

  return categoryMap[group] || group;
}
