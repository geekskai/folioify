"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";

interface Tool {
  id: number;
  handle: string;
  image?: string;
  website?: string;
  website_logo?: string;
  website_name?: string;
  what_is_summary?: string;
  month_visited_count?: number;
  category_handle?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryDetailPageProps {
  slug: string;
}

export function CategoryDetailPage({ slug }: CategoryDetailPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("AI Tools");
  const [tools, setTools] = useState<Tool[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 30;

  const fetchToolData = useCallback(
    async (currentPage = 1, loadMore = false) => {
      if (!loadMore) {
        setIsLoading(true);
      }

      try {
        const supabase = createClient();

        // Get category name from slug (format it for display)
        const formattedCategoryName = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setCategoryName(formattedCategoryName);

        // Then fetch tools for this category with pagination
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data: toolsData, error: toolsError } = await supabase
          .from("category_item_detail")
          .select("*")
          .eq("category_handle", slug)
          .order("month_visited_count", { ascending: false })
          .range(from, to);

        if (toolsError) {
          console.error("Error fetching tools:", toolsError);
          return;
        }

        if (toolsData) {
          if (loadMore) {
            setTools((prevTools) => [...prevTools, ...toolsData]);
          } else {
            setTools(toolsData);
          }

          // Check if we have more items to load
          setHasMore(toolsData.length === itemsPerPage);
        }
      } catch (error) {
        console.error("Error fetching tool data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    fetchToolData(1);
  }, [slug, fetchToolData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchToolData(nextPage, true);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="animate-pulse">
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            <Home className="h-4 w-4 inline mr-1" />
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/category" className="hover:text-gray-700">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </div>

        {/* Tool Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-md transition-all p-4 h-full rounded-xl bg-white border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {tool.website_logo ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                          <Image
                            src={tool.website_logo}
                            alt={tool.website_name || ""}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {tool.website_name?.charAt(0) || "T"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 text-base">
                        {tool.website_name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
                        {tool.what_is_summary}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
