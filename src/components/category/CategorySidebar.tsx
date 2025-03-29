import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  categories: Category[];
}

export function CategorySidebar({
  activeCategory,
  onCategoryClick,
  categories,
}: CategorySidebarProps) {
  // 使用本地状态来管理高亮，避免闪动
  const [localActiveCategory, setLocalActiveCategory] =
    useState(activeCategory);

  // 使用useMemo预先计算每个分类的高亮状态
  const categoryActiveStates = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.id === localActiveCategory;
      return acc;
    }, {} as Record<string, boolean>);
  }, [categories, localActiveCategory]);

  // 当props中的activeCategory变化时，更新本地状态
  useEffect(() => {
    setLocalActiveCategory(activeCategory);
  }, [activeCategory]);

  // 处理点击事件
  const handleClick = (categoryId: string) => {
    // 立即更新本地状态，避免闪动
    setLocalActiveCategory(categoryId);
    // 调用父组件的点击处理函数
    onCategoryClick(categoryId);
  };

  return (
    <ul className="space-y-2">
      {categories.map((category) => {
        // 使用预计算的高亮状态
        const isActive = categoryActiveStates[category.id];

        return (
          <li key={category.id}>
            <button
              onClick={() => handleClick(category.id)}
              // 使用CSS变量来控制高亮颜色，减少重绘
              style={
                {
                  "--highlight-bg": isActive
                    ? "rgb(238, 242, 255)"
                    : "transparent",
                  "--highlight-text": isActive ? "rgb(79, 70, 229)" : "inherit",
                  "--highlight-weight": isActive ? "500" : "normal",
                } as React.CSSProperties
              }
              className={`block w-full text-left px-4 py-2 rounded-md 
                bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-[var(--highlight-weight)]
                hover:bg-gray-100 transition-colors duration-150`}
            >
              {category.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
