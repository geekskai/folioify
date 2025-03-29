// 修改这个文件以解决searchParams错误
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";

interface PageProps {
  searchParams: { group?: string };
}

export default async function Page({ searchParams }: PageProps) {
  // 使用await处理searchParams
  const group = searchParams.group || "text-writing";

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPage group={group} />
    </Suspense>
  );
}
