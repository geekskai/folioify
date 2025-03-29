// 修改这个文件以解决searchParams错误
import { Suspense } from "react";
import { CategoryPage } from "@/components/category/CategoryPage";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";

// 定义参数类型为 Promise
type Params = Promise<object>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  // 等待解析 Promise
  const searchParams = await props.searchParams;

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
