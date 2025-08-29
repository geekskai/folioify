// AI Tools Category Page - Optimized for SEO and user discovery
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { Metadata } from "next";

// Enable dynamic rendering to ensure fresh data for AI tools
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tools Categories | Browse by Use Case & Industry",
  description:
    "Explore AI tools organized by categories including writing, image generation, chatbots, automation, business intelligence, and more. Find the perfect AI solution for your specific needs with our comprehensive directory.",
  keywords: [
    "AI tools categories",
    "AI tools by category",
    "AI writing tools",
    "AI image generators",
    "AI chatbots",
    "AI automation tools",
    "business AI tools",
    "AI productivity tools",
    "machine learning tools",
    "AI software categories",
  ],
  openGraph: {
    title: "AI Tools Categories | Browse by Use Case & Industry",
    description:
      "Explore AI tools organized by categories. Find the perfect AI solution for your specific needs.",
    type: "website",
    url: "https://www.folioify.com/category",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Categories | Browse by Use Case & Industry",
    description:
      "Explore AI tools organized by categories. Find the perfect AI solution for your specific needs.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.folioify.com/category",
  },
};

// Define searchParams type as Promise for Next.js 15+ compatibility
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await Promise resolution for search parameters
  const resolvedParams = await searchParams;

  // Extract group parameter with default fallback to popular AI category
  const group =
    typeof resolvedParams.group === "string"
      ? resolvedParams.group
      : "text-writing";

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPage group={group} />
    </Suspense>
  );
}
