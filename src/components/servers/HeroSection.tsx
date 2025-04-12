import { ServerSearchBar } from "./ServerSearchBar";
import { useSearchParams } from "next/navigation";

interface HeroSectionProps {
  categoryCount: number;
  totalItemsCount: number;
}

export function HeroSection({
  categoryCount,
  totalItemsCount,
}: HeroSectionProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

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

      <div className="mt-6 w-full max-w-2xl">
        <ServerSearchBar />
      </div>

      {searchQuery && (
        <div className="mt-4 text-indigo-700 font-medium">
          Showing results for: "{searchQuery}"
        </div>
      )}
    </div>
  );
}
