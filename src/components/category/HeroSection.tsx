interface HeroSectionProps {
  categoryCount: number;
}

export function HeroSection({ categoryCount }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-10 mb-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
        Find AI By Categories
      </h1>
      <p className="text-gray-600 text-lg">
        Browse through {categoryCount} categories to discover the perfect AI
        tools for your needs
      </p>
    </div>
  );
}
