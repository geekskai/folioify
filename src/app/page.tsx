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
