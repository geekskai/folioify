"use client";

import Link from "next/link";

interface TagProps {
  tag: string;
}

export function Tag({ tag }: TagProps) {
  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
      className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition-colors"
    >
      #{tag}
    </Link>
  );
}
