import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export interface FeaturedTool {
  id: string | number;
  name: string;
  description: string;
  imageUrl?: string;
  category?: string;
  subcategory?: string;
  views?: number;
  popularity?: string;
  growthRate?: string;
  url: string;
  by?: string;
  icon?: string;
  tags?: string[];
  isFavorite?: boolean;
  mcpName?: string;
  mcpBy?: string;
  github?: string;
  imageSrc?: string;
}

interface FeaturedSectionProps {
  tools: FeaturedTool[];
}

export function FeaturedSection({ tools }: FeaturedSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">
        Featured<sup>*</sup>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={tool.url} className="block">
              <div className="relative h-40 bg-gray-100">
                {(tool.imageUrl || tool.imageSrc) && (
                  <Image
                    src={tool.imageUrl || tool.imageSrc || ""}
                    alt={tool.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                  Featured
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-2 h-2 mr-1"></span>
                  <span className="mr-4">
                    {tool.category || tool.tags?.[0] || "Featured"}
                  </span>
                  {tool.views && <span>👁 {tool.views}</span>}
                  {tool.by ||
                    (tool.mcpBy && (
                      <span className="ml-2">By: {tool.by || tool.mcpBy}</span>
                    ))}
                </div>
                {tool.popularity && (
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="mr-2">📈 {tool.popularity}</span>
                    {tool.growthRate && (
                      <span className="text-green-500">
                        ↑ {tool.growthRate}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tool.description}
                </p>
                {tool.subcategory && (
                  <div className="mt-3 text-xs">
                    <span className="text-gray-500">{tool.subcategory}</span>
                    <span className="ml-2 px-1 bg-gray-100 text-gray-500 rounded">
                      AD
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
