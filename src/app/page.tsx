import { Hero } from "@/components/home/Hero";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { ToolboxSection } from "@/components/home/ToolboxSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { JustLaunchedSection } from "@/components/home/JustLaunchedSection";
import { FeaturedToolsSection } from "@/components/home/FeaturedToolsSection";
import { ToolCategories } from "@/components/home/ToolCategories";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* 工具分类导航 */}
        <ToolCategories />

        {/* 最新发布工具 */}
        <JustLaunchedSection />

        {/* 特色工具 */}
        <FeaturedToolsSection />

        {/* 工具箱部分 */}
        {/* <ToolboxSection /> */}

        {/* 特色文章 */}
        {/* <FeaturedArticles /> */}

        {/* 订阅通讯 */}
        <NewsletterSection />
      </div>
    </>
  );
}
