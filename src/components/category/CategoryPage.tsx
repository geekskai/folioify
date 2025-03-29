"use client";

import { useEffect, useState, useRef } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryToolList } from "./CategoryToolList";
import { CategoryHeader } from "./CategoryHeader";
import { CategorySkeleton } from "./CategorySkeleton";

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
  }>;
}

export function CategoryPage({ group }: CategoryPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(group);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        // 模拟获取所有分类数据
        const sections = generateCategorySections();
        setCategorySections(sections);
        setActiveSection(group);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [group]);

  useEffect(() => {
    // 监听滚动事件，更新当前活动的分类
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // 添加一些偏移量

      // 找到当前在视图中的分类
      for (const sectionId in sectionRefs.current) {
        const element = sectionRefs.current[sectionId];
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categorySections]);

  // 处理导航点击
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 20, // 添加一些偏移量
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader categoryName="AI工具分类" />
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
        <div className="flex-1">
          {categorySections.map((section) => (
            <div
              key={section.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[section.id] = el;
                return undefined;
              }}
              id={`section-${section.id}`}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">{section.name}</h2>
              <CategoryToolList tools={section.tools} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 生成所有分类数据
function generateCategorySections(): CategorySection[] {
  const categories = [
    { id: "text-writing", name: "文本写作" },
    { id: "image", name: "图像" },
    { id: "video", name: "视频" },
    { id: "code-it", name: "代码/IT" },
    { id: "voice", name: "语音" },
    { id: "business", name: "商业" },
    { id: "marketing", name: "营销" },
    { id: "ai-detector", name: "AI检测" },
    { id: "chatbot", name: "聊天机器人" },
    { id: "design-art", name: "设计与艺术" },
    { id: "life-assistant", name: "生活助手" },
    { id: "3d", name: "3D" },
    { id: "education", name: "教育" },
    { id: "prompt", name: "提示词" },
    { id: "productivity", name: "生产力" },
    { id: "other", name: "其他" },
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
      { id: 1, name: "AI Blog Writer", count: 522 },
      { id: 2, name: "Handwriting", count: 56 },
      { id: 3, name: "Essay Writer", count: 295 },
      { id: 4, name: "Report Writing", count: 280 },
      { id: 5, name: "AI Story Writing", count: 472 },
      { id: 6, name: "Paraphraser", count: 572 },
      { id: 7, name: "Pick-up Lines Generator", count: 44 },
      { id: 8, name: "Writing Assistants", count: 2341 },
      { id: 9, name: "AI Content Generator", count: 4064 },
      { id: 10, name: "Quotes Generator", count: 24 },
      { id: 11, name: "Translate", count: 587 },
      { id: 12, name: "Copywriting", count: 893 },
      { id: 13, name: "Letter Writer", count: 175 },
      { id: 14, name: "AI Rewriter", count: 671 },
      { id: 15, name: "AI Bio Generator", count: 147 },
      { id: 16, name: "AI Poem & Poetry Generator", count: 69 },
      { id: 17, name: "Transcription", count: 591 },
      { id: 18, name: "AI Creative Writing", count: 597 },
      { id: 19, name: "AI Email Writer", count: 796 },
      { id: 20, name: "AI Product Description Generator", count: 2158 },
    ];
  } else if (group === "image") {
    return [
      { id: 21, name: "Text to Image", count: 795 },
      { id: 22, name: "AI Photo & Image Generator", count: 1983 },
      { id: 23, name: "AI Illustration Generator", count: 483 },
      { id: 24, name: "AI Avatar Generator", count: 410 },
      { id: 25, name: "AI Background Generator", count: 345 },
      { id: 26, name: "AI Banner Generator", count: 271 },
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
    "text-writing": "文本写作",
    image: "图像",
    video: "视频",
    "code-it": "代码/IT",
    voice: "语音",
    business: "商业",
    marketing: "营销",
    "ai-detector": "AI检测",
    chatbot: "聊天机器人",
    "design-art": "设计与艺术",
    "life-assistant": "生活助手",
    "3d": "3D",
    education: "教育",
    prompt: "提示词",
    productivity: "生产力",
    other: "其他",
  };

  return categoryMap[group] || group;
}
