import { Suspense } from "react";
// import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { CategoryPage } from "@/components/servers/CategoryPage";

// 定义 searchParams 为 Promise 类型
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ServerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 等待解析 Promise
  const resolvedParams = await searchParams;

  // 获取 group 参数，确保它是字符串类型
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
