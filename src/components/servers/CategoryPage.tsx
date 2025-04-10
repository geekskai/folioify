"use client";

import { useEffect, useState, useRef } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryToolList } from "./CategoryToolList";
// import { CategoryHeader } from "./CategoryHeader";
import { CategorySkeleton } from "./CategorySkeleton";
import { HeroSection } from "./HeroSection";
import { FeaturedSection } from "./FeaturedSection";
import { useRouter } from "next/navigation";
import { createClient } from "@/db/supabase/client";

interface CategoryPageProps {
  group: string;
}

interface CategorySection {
  id: string;
  name: string;
  // tools?: any[];
}

// 模拟特色工具数据
const featuredTools = [
  {
    id: 1,
    name: "iFable",
    description:
      "Your Personal Anime Universe Generated by AI: Where Every Character Has a Story",
    imageUrl: "/images/tools/ifable.png",
    category: "--",
    views: 4,
    url: "/tools/ifable",
  },
  {
    id: 2,
    name: "Rubli AI",
    description:
      "Rubli AI native fandom character UGC platform. Create your character, feed stories, join community.",
    imageUrl: "/images/tools/rubli-ai.png",
    category: "AI Character",
    subcategory: "Novel",
    views: 45,
    popularity: "475.0K",
    growthRate: "33.83%",
    url: "/tools/rubli-ai",
  },
  {
    id: 3,
    name: "Powered_By",
    description:
      "Custom AI agents tailored for small and medium-sized businesses.",
    imageUrl: "/images/tools/powered-by.png",
    category: "AI Voice Assistants",
    views: 6,
    url: "/tools/powered-by",
  },
  {
    id: 4,
    name: "Easycart",
    description: "Create a high converting one-click checkout in minutes",
    imageUrl: "/images/tools/easycart.png",
    category: "No Code/Low Code",
    views: 0,
    popularity: "133.8K",
    growthRate: "81.37%",
    url: "/tools/easycart",
  },
];

export function CategoryPage({ group }: CategoryPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(group);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const initialScrollDone = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 确保activeSection始终与URL参数同步
  useEffect(() => {
    if (group !== activeSection) {
      setActiveSection(group);
      initialScrollDone.current = false; // 重置滚动状态，允许重新滚动
    }
  }, [group, activeSection]);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data: A_MCP_category } = await supabase
          .from("A_MCP_category")
          .select("*");

        const categories = A_MCP_category || [];

        setCategorySections(categories);
      } catch (error) {
        console.error("获取分类数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 初始化滚动到指定分类
  useEffect(() => {
    if (
      !isLoading &&
      !initialScrollDone.current &&
      categorySections.length > 0
    ) {
      // 等待DOM更新完成后再滚动
      setTimeout(() => {
        const element = sectionRefs.current[group];
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
  }, [isLoading, group, categorySections]);

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
    router.push(`/mcp-servers?group=${sectionId}`, { scroll: false });

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
              categories={categorySections.map((section) => ({
                id: section.id,
                name: section.name,
              }))}
            />
          </div>
        </div>
        <div className="flex-1" ref={contentRef}>
          {/* 添加Featured部分 */}
          <FeaturedSection tools={featuredTools} />

          {categorySections.map((section) => (
            <div
              key={section.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[section.id] = el;
                return undefined;
              }}
              id={`section-${section.id}`}
              className="mb-8 pt-4" // 减小底部间距，添加顶部内边距用于滚动定位
            >
              <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
              {/* <CategoryToolList tools={section.tools || []} /> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
