import { SearchBar } from "../home/SearchBar";

interface HeroSectionProps {
  categoryCount: number;
  totalItemsCount: number;
}

export function HeroSection({
  categoryCount,
  totalItemsCount,
}: HeroSectionProps) {
  return (
    <div className="bg-indigo-50 gap-4 rounded-lg p-8 mb-8 flex justify-center flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Find MCP Servers and Clients</h1>

      <p className="text-gray-600">
        Explore over{" "}
        <span className="font-bold text-xl text-indigo-600">
          {categoryCount}
        </span>{" "}
        categories featuring more than{" "}
        <span className="font-bold text-xl text-indigo-600">
          {totalItemsCount}
        </span>{" "}
        items to find the perfect MCP Servers and Clients solution.
      </p>
      <SearchBar />
    </div>
  );
}
