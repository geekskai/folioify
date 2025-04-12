import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  icon?: string;
  by?: string;
  tags?: string[];
  url: string;
  isFavorite?: boolean;
  mcpBy?: string;
  mcpName?: string;
  github?: string;
  imageSrc?: string;
}

export function CategoryCard({
  name,
  description,
  icon = "/placeholder-icon.png",
  by,
  mcpBy,
  tags = [],
  url,
  github,
  isFavorite = false,
  imageSrc,
}: CategoryCardProps) {
  // 使用以下优先级: mcpBy > by
  const displayBy = mcpBy || by;
  // 使用以下优先级: github > url
  const linkUrl = github || url || "#";
  // 使用以下优先级: imageSrc > icon
  const displayImage = imageSrc || icon;

  return (
    <div
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col w-full max-w-md relative"
      suppressHydrationWarning
    >
      {/* Favorite Star Button */}
      <button
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-500 transition-colors"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className={isFavorite ? "fill-yellow-400" : ""} size={20} />
      </button>

      <div className="flex items-start space-x-4 mb-3">
        {/* Icon */}
        <div className="w-12 h-12 relative flex-shrink-0">
          <Image
            src={displayImage}
            alt={`${name} icon`}
            width={48}
            height={48}
            className="object-contain"
            onError={(e) => {
              // 如果图片加载失败，使用默认图片
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-icon.png";
            }}
            unoptimized={displayImage.startsWith("http")}
            priority={true}
          />
        </div>

        {/* Title and Author */}
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          {displayBy && (
            <div className="text-sm text-gray-600">
              by <span className="text-orange-500">{displayBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className="text-gray-700 text-sm mb-4 flex-grow"
        suppressHydrationWarning
      >
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
            >
              # {tag}
            </span>
          ))}
      </div>

      {/* Navigate Link */}
      <Link
        href={linkUrl}
        className="absolute bottom-4 right-4 p-1 text-gray-500 hover:text-gray-700"
        target={github ? "_blank" : "_self"}
        rel={github ? "noopener noreferrer" : ""}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  );
}
