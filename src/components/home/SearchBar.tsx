"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Mic, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

// 导入搜索数据和类型
import { searchTools, SearchItem } from "@/data/search-data";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    router.push(`/tools/${suggestion.h}`);
    setShowSuggestions(false);
  };

  // 清除搜索内容
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // 语音搜索
  const startVoiceSearch = () => {
    // 这里可以实现语音搜索功能
    alert("语音搜索功能即将上线");
  };

  // 图片搜索
  const startImageSearch = () => {
    // 这里可以实现图片搜索功能
    alert("图片搜索功能即将上线");
  };

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
      // 使用辅助函数搜索工具
      const searchResults = searchTools(debouncedSearchTerm).slice(0, 8);
      setSuggestions(searchResults);
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
            placeholder="搜索AI工具、应用或服务..."
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
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <button
            type="button"
            onClick={startVoiceSearch}
            className="text-blue-500 hover:text-blue-600 p-2"
            title="语音搜索"
          >
            <Mic size={18} />
          </button>
          <button
            type="button"
            onClick={startImageSearch}
            className="text-blue-500 hover:text-blue-600 p-2 mr-1"
            title="图片搜索"
          >
            <Camera size={18} />
          </button>
          <Button
            type="submit"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 h-10"
          >
            搜索
          </Button>
        </div>
      </form>

      {/* 搜索建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search
                  size={16}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium text-gray-800">
                    {suggestion.n}
                  </span>
                  {suggestion.c > 0 && (
                    <span className="text-xs text-gray-500 mt-0.5">
                      热度:{" "}
                      {suggestion.c > 1000
                        ? `${(suggestion.c / 1000).toFixed(1)}K`
                        : suggestion.c}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
