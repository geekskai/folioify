import Link from "next/link";

interface Tool {
  id: number;
  name: string;
  count: number;
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
          href={`/tool/${tool.id}`}
          className="block p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{tool.name}</h3>
            <span className="text-sm text-gray-500">{tool.count}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
