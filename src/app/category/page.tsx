// 修改这个文件以解决静态生成错误
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";

// 添加导出配置，设置为动态渲染
export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 获取 group 参数，确保它是字符串类型
  const group =
    typeof searchParams.group === "string"
      ? searchParams.group
      : "text-writing";

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPage group={group} />
    </Suspense>
  );
}
