import { Suspense } from "react";
import { CategoryDetailPage as CategoryDetailComponent } from "@/components/category/detail/CategoryDetailPage";
import { Metadata, ResolvingMetadata } from "next";

// Add dynamic rendering to ensure we get the latest data
export const dynamic = "force-dynamic";

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  // Format the slug for display
  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Best ${formattedTitle} Tools in 2025 | Folioify`,
    description: `Discover the top ${formattedTitle.toLowerCase()} tools to enhance your productivity and creativity. Compare features and find the perfect solution for your needs.`,
    alternates: {
      canonical: `https://www.folioify.com/category/${slug}`,
    },
  };
}

// Define the Page component
export default async function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetailComponent slug={slug} />
    </Suspense>
  );
}

// Skeleton component for loading state
function CategoryDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-6"></div>
      </div>
    </div>
  );
}
