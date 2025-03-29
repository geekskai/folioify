"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Flame } from "lucide-react";
// 移除了 Mic 和 Camera 图标的导入
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

// 导入搜索数据和类型
import { searchTools, searchCategories, SearchItem } from "@/data/search-data";
import { ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 判断是否为分类项
  const isCategoryItem = (item: SearchItem) => {
    // 从categories中获取所有分类ID
    const categoryIds = categories.map((cat) => cat.id);

    // 检查item的handle是否匹配任何分类ID
    return categoryIds.some(
      (catId) =>
        item.h.includes(catId) ||
        // 处理一些特殊情况
        (catId === "text-writing" &&
          (item.h.includes("writer") ||
            item.h.includes("writing") ||
            item.h.includes("text")))
    );
  };

  // 使用防抖减少搜索频率
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: SearchItem) => {
    setSearchQuery(suggestion.n);

    // 使用已定义的 isCategoryItem 函数判断是否为分类项
    if (isCategoryItem(suggestion)) {
      // 确定应该跳转到哪个分类组
      let categoryGroup = "text-writing"; // 默认分类

      if (
        suggestion.h.includes("image") ||
        suggestion.h.includes("avatar") ||
        suggestion.h.includes("background")
      ) {
        categoryGroup = "image";
      } else if (suggestion.h.includes("video")) {
        categoryGroup = "video";
      } else if (
        suggestion.h.includes("code") ||
        suggestion.h.includes("developer")
      ) {
        categoryGroup = "code-it";
      } else if (
        suggestion.h.includes("voice") ||
        suggestion.h.includes("audio")
      ) {
        categoryGroup = "voice";
      } else if (suggestion.h.includes("business")) {
        categoryGroup = "business";
      } else if (suggestion.h.includes("marketing")) {
        categoryGroup = "marketing";
      } else if (suggestion.h.includes("detector")) {
        categoryGroup = "ai-detector";
      } else if (
        suggestion.h.includes("chatbot") ||
        suggestion.h.includes("chat")
      ) {
        categoryGroup = "chatbot";
      } else if (
        suggestion.h.includes("design") ||
        suggestion.h.includes("art")
      ) {
        categoryGroup = "design-art";
      } else if (
        suggestion.h.includes("assistant") &&
        !suggestion.h.includes("business")
      ) {
        categoryGroup = "life-assistant";
      } else if (suggestion.h.includes("3d")) {
        categoryGroup = "3d";
      } else if (
        suggestion.h.includes("education") ||
        suggestion.h.includes("learning")
      ) {
        categoryGroup = "education";
      } else if (suggestion.h.includes("prompt")) {
        categoryGroup = "prompt";
      } else if (suggestion.h.includes("productivity")) {
        categoryGroup = "productivity";
      }

      // 跳转到对应的分类页面
      router.push(`/category?group=${categoryGroup}`);
    } else {
      // 如果不是分类项，则跳转到工具详情页
      router.push(`/tools/${suggestion.h}`);
    }

    setShowSuggestions(false);
  };

  // 清除搜索内容
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // 移除了语音搜索和图片搜索函数

  // 监听点击事件，点击外部时关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 当搜索查询变化时，更新建议
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      // 首先搜索分类
      const categoryResults = searchCategories(debouncedSearchTerm).slice(0, 5);
      // console.log(`🚀 ~ categoryResults:`, categoryResults);
      // 然后搜索工具
      // const toolResults = searchTools(debouncedSearchTerm).slice(0, 3);

      // 合并结果，分类在前，工具在后
      // setSuggestions([...categoryResults, ...toolResults]);
      setSuggestions([...categoryResults]);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white rounded-full p-1 pl-5 shadow-md hover:shadow-lg transition-shadow">
          <Search size={20} className="text-gray-400 mr-2" />
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for AI tools, apps or services..."
            className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 text-gray-700 py-3"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={18} />
            </button>
          )}
          {/* 移除了分隔线和语音、图片搜索按钮 */}
          <Button
            type="submit"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 h-10 ml-2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* 搜索建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100"
        >
          {suggestions.filter((item) => isCategoryItem(item)).length > 0 && (
            <div className="text-xs text-gray-500 px-5 py-2">
              Categories(
              {suggestions.filter((item) => isCategoryItem(item)).length})
            </div>
          )}
          <div>
            {suggestions.map((suggestion, index) => {
              const isCategory = isCategoryItem(suggestion);

              return (
                <div
                  key={index}
                  className="flex items-center px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search
                    size={16}
                    className="text-gray-400 mr-3 flex-shrink-0"
                  />
                  <div className="flex justify-between w-full items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-800">
                        {suggestion.n}
                      </span>
                      {isCategory && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({suggestion.c > 0 ? suggestion.c : 0} tools)
                        </span>
                      )}
                    </div>

                    {isCategory ? (
                      <ChevronRight size={16} className="text-gray-400" />
                    ) : (
                      suggestion.c > 0 && (
                        <span className="text-xs text-orange-500">
                          {suggestion.c > 1000
                            ? `${(suggestion.c / 1000).toFixed(1)}K`
                            : suggestion.c}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
