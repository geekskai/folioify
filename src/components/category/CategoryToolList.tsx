import Link from "next/link";

interface Tool {
  id: number;
  name: string;
  count: number;
  handle?: string;
}

interface CategoryToolListProps {
  tools?: Tool[];
}

export function CategoryToolList({ tools }: CategoryToolListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools?.map((tool) => (
        <Link
          key={tool.id}
          target="_blank"
          href={`/category/${
            tool.handle || tool.name.toLowerCase().replace(/\s+/g, "-")
          }`}
          className="block p-4 border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow transition-all duration-200"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">{tool.name}</h3>
            <span className="text-violet-600 font-medium">{tool.count}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
