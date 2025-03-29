import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  categories: Category[];
}

export function CategorySidebar({
  activeCategory,
  onCategoryClick,
  categories,
}: CategorySidebarProps) {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <button
            onClick={() => onCategoryClick(category.id)}
            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
              activeCategory === category.id
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
