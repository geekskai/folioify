"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { createClient } from "@/db/supabase/client";

interface Tool {
  id: number;
  name: string;
  description?: string;
  tool_count: number;
  handle?: string;
  url?: string;
  by?: string;
  tags?: string[];
  icon?: string;
}

interface CategoryDetailPageProps {
  slug: string;
}

export function CategoryDetailPage({ slug }: CategoryDetailPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [toolData, setToolData] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchToolData = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // First try to get data by handle
        const { data: toolByHandle, error: handleError } = await supabase
          .from("category_values")
          .select("*")
          .eq("handle", slug)
          .single();

        if (handleError && handleError.code !== "PGRST116") {
          console.error("Error fetching tool by handle:", handleError);
        }

        // If not found by handle, try by normalized name
        if (!toolByHandle) {
          const { data: toolByName, error: nameError } = await supabase
            .from("category_values")
            .select("*")
            .ilike("name", slug.replace(/-/g, "%"))
            .single();

          if (nameError && nameError.code !== "PGRST116") {
            console.error("Error fetching tool by name:", nameError);
          }

          if (toolByName) {
            setToolData(toolByName);

            // Fetch related tools from the same group
            if (toolByName.group_id) {
              const { data: related, error: relatedError } = await supabase
                .from("category_values")
                .select("*")
                .eq("group_id", toolByName.group_id)
                .neq("id", toolByName.id)
                .order("tool_count", { ascending: false })
                .limit(6);

              if (relatedError) {
                console.error("Error fetching related tools:", relatedError);
              } else {
                setRelatedTools(related || []);
              }
            }
          }
        } else {
          setToolData(toolByHandle);

          // Fetch related tools from the same group
          if (toolByHandle.group_id) {
            const { data: related, error: relatedError } = await supabase
              .from("category_values")
              .select("*")
              .eq("group_id", toolByHandle.group_id)
              .neq("id", toolByHandle.id)
              .order("tool_count", { ascending: false })
              .limit(6);

            if (relatedError) {
              console.error("Error fetching related tools:", relatedError);
            } else {
              setRelatedTools(related || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching tool data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolData();
  }, [slug]);

  if (isLoading) {
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

  if (!toolData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="mb-6">The requested tool could not be found.</p>
          <Link href="/category" className="text-blue-600 hover:underline">
            Return to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
        <span className="text-gray-900 font-medium">{toolData.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Best {toolData.tool_count} {toolData.name} Tools in 2025
        </h1>
        <p className="text-gray-600">
          Discover the top {toolData.name.toLowerCase()} tools to enhance your
          productivity and creativity. These AI-powered solutions offer
          cutting-edge features for professionals and enthusiasts alike.
        </p>
      </div>

      {/* Tool Grid - We would replace this with actual tools, but for now showing featured items */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          Featured {toolData.name} Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-violet-600 font-bold">
                    {toolData.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">
                  {toolData.name} Tool {i + 1}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  A powerful {toolData.name.toLowerCase()} solution with
                  advanced AI capabilities.
                </p>
                <a
                  href="#"
                  className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                >
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Categories */}
      {relatedTools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/category/${
                  tool.handle || tool.name.toLowerCase().replace(/\s+/g, "-")
                }`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{tool.name}</h3>
                  <span className="text-violet-600 font-medium">
                    {tool.tool_count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
