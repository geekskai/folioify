export function CategorySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-64 bg-gray-200 rounded-md mb-8 animate-pulse"></div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
