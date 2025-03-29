import Link from "next/link";
import { useEffect, useState } from "react";

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
        const isActive = localActiveCategory === category.id;

        return (
          <li key={category.id}>
            <button
              onClick={() => handleClick(category.id)}
              className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
