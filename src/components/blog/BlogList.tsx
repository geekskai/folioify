"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Blog } from "contentlayer/generated";
import { Tag } from "./Tag";

interface BlogListProps {
  posts: Blog[];
  showTags?: boolean;
}

export function BlogList({ posts, showTags = true }: BlogListProps) {
  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:translate-y-[-5px]"
        >
          <Link href={post.url} className="block">
            <div className="relative h-48 w-full">
              {post.cover ? (
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600" />
              )}
            </div>
          </Link>
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="mx-2">•</span>
              <span>{post.readingTime?.text || "3 min read"}</span>
            </div>
            <Link href={post.url} className="block">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {post.description}
            </p>
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
