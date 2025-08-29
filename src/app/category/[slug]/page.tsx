import { Suspense } from "react";
import { CategoryDetailPage as CategoryDetailComponent } from "@/components/category/detail/CategoryDetailPage";
import { Metadata, ResolvingMetadata } from "next";

// Add dynamic rendering to ensure we get the latest data
export const dynamic = "force-dynamic";

// Generate SEO-optimized metadata for AI tools category pages
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  // Format slug for display with AI tools context
  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Create SEO-optimized title and description for AI tools
  const seoTitle = `Best ${formattedTitle} AI Tools in 2025 | Compare Features & Pricing`;
  const seoDescription = `Discover the top ${formattedTitle.toLowerCase()} AI tools and software. Compare features, pricing, and user reviews. Find the perfect AI solution for ${formattedTitle.toLowerCase()} to boost your productivity and efficiency.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      `${formattedTitle.toLowerCase()} AI tools`,
      `best ${formattedTitle.toLowerCase()} AI`,
      `AI ${formattedTitle.toLowerCase()} software`,
      `${formattedTitle.toLowerCase()} automation`,
      `AI tools for ${formattedTitle.toLowerCase()}`,
      `${formattedTitle.toLowerCase()} AI solutions`,
      `artificial intelligence ${formattedTitle.toLowerCase()}`,
      `${formattedTitle.toLowerCase()} AI comparison`,
    ],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      url: `https://www.folioify.com/category/${slug}`,
      images: [
        {
          url: `/images/categories/${slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `Best ${formattedTitle} AI Tools`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [`/images/categories/${slug}-twitter.jpg`],
    },
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
