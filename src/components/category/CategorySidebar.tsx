import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";

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
  // 添加一个标记来跟踪是否正在滚动
  const isScrolling = useRef(false);
  // 添加一个标记来跟踪用户点击
  const userClicked = useRef(false);

  // 使用useMemo预先计算每个分类的高亮状态
  const categoryActiveStates = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.id === localActiveCategory;
      return acc;
    }, {} as Record<string, boolean>);
  }, [categories, localActiveCategory]);

  // 当props中的activeCategory变化时，更新本地状态，但仅在非滚动状态下
  useEffect(() => {
    // 如果是用户点击触发的，不要更新本地状态
    if (userClicked.current) {
      userClicked.current = false;
      return;
    }

    // 如果不是正在滚动，则更新本地状态
    if (!isScrolling.current) {
      setLocalActiveCategory(activeCategory);
    }
  }, [activeCategory]);

  // 处理点击事件
  const handleClick = (categoryId: string) => {
    // 标记这是用户点击
    userClicked.current = true;
    // 标记正在滚动
    isScrolling.current = true;

    // 立即更新本地状态，避免闪动
    setLocalActiveCategory(categoryId);

    // 调用父组件的点击处理函数
    onCategoryClick(categoryId);

    // 设置一个定时器，在滚动完成后重置滚动状态
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000); // 假设滚动不会超过1秒
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2">
      <ul className="space-y-1">
        {categories.map((category) => {
          // 使用预计算的高亮状态
          const isActive = categoryActiveStates[category.id];

          return (
            <li key={category.id}>
              <button
                onClick={() => handleClick(category.id)}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ${
                  isActive
                    ? "bg-violet-100 text-violet-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
