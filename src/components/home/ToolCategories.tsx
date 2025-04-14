import Link from "next/link";
import { categories } from "@/data/categories";

export function ToolCategories() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category?group=${category.id}`}
            className="whitespace-nowrap px-4 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {category.name}
          </Link>
        ))}
        <Link
          href="/category"
          className="whitespace-nowrap px-4 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          More +
        </Link>
      </div>
    </div>
  );
}
