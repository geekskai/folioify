// 修改这个文件以解决searchParams错误
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";

// 修改 PageProps 接口以符合 Next.js 的类型要求
interface PageProps {
  params: object;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
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
