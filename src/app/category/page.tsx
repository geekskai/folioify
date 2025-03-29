// 修改这个文件以解决静态生成错误
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";

// 添加导出配置，设置为动态渲染
export const dynamic = "force-dynamic";

// 使用 Next.js 15 推荐的类型定义方式
type Props = {
  params: Record<string, never>;
  searchParams: Record<string, string | string[] | undefined>;
};

export default function Page({ searchParams }: Props) {
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
