"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { JustLaunchedSection } from "@/components/home/JustLaunchedSection";
import { ToolCategories } from "@/components/home/ToolCategories";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/mcp-servers?category=all&search=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        {/* 英雄部分 */}
        <Hero />

        <div className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            搜索 MCP 服务器
          </h2>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center bg-gray-50 rounded-lg p-1 pl-5 border border-gray-200 hover:border-indigo-300 transition-colors">
              <Search size={20} className="text-gray-400 mr-2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入关键词搜索服务器..."
                className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 text-gray-700 py-3"
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 h-10 rounded-md ml-2"
              >
                搜索
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Link
              href="/mcp-servers?category=all&search=github"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/mcp-servers?category=all&search=server"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
            >
              Server
            </Link>
            <Link
              href="/mcp-servers?category=all&search=client"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
            >
              Client
            </Link>
            <Link
              href="/mcp-servers?category=all&search=host"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
            >
              Hosting
            </Link>
          </div>
        </div>

        {/* 工具分类导航 */}
        <ToolCategories />

        {/* 最新发布工具 */}
        <JustLaunchedSection />

        {/* 订阅通讯 */}
        <NewsletterSection />
      </div>
    </>
  );
}
