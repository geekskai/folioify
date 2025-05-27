"use client";

import { Hero } from "@/components/home/Hero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { JustLaunchedSection } from "@/components/home/JustLaunchedSection";
import { ToolCategories } from "@/components/home/ToolCategories";

export default function Home() {
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
