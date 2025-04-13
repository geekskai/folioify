export function ContentSkeleton() {
  return (
    <div className="flex-1">
      {/* Section title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>

      {/* Tools grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-100 rounded-lg border border-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
