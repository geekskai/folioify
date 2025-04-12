export function CategoryContentSkeleton() {
  return (
    <div className="mb-8 pt-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded-md w-64 mb-6"></div>

      {/* Grid of card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-3">
              {/* Icon skeleton */}
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
            {/* Description skeleton - multiple lines */}
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center items-center mt-4 mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
