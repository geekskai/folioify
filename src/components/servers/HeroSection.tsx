interface HeroSectionProps {
  categoryCount: number;
}

export function HeroSection({ categoryCount }: HeroSectionProps) {
  return (
    <div className="bg-indigo-50 rounded-lg p-8 mb-8 flex justify-center flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Find AI By Categories</h1>
      <p className="text-gray-600">
        Over {categoryCount} categories to find AI websites and tools.
      </p>
    </div>
  );
}
