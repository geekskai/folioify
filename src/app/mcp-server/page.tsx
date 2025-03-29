import { Hero } from "@/components/home/Hero";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { ToolboxSection } from "@/components/home/ToolboxSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function ServerPage() {
  return (
    <>
      <Hero />
      <ToolboxSection />
      <FeaturedArticles />
      <NewsletterSection />
    </>
  );
}
