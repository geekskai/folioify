import { Suspense } from "react";
// import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { CategoryPage } from "@/components/servers/CategoryPage";

// Define searchParams as Promise type for Next.js 15+ compatibility
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ServerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await Promise resolution for search parameters
  const resolvedParams = await searchParams;

  // Extract category parameter with default fallback to popular MCP category
  const category =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : "text-writing";
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPage category={category} />
    </Suspense>
  );
}
