import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Blog } from "contentlayer/generated";

/**
 * Combines multiple class values using clsx and tailwind-merge
 * @param inputs - Class values to be merged
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a localized date format
 * @param date - ISO date string to format
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Sorts an array of objects with date properties in descending order (newest first)
 * @param posts - Array of objects containing date properties
 * @returns Sorted array of posts
 */
export function sortBlogPostsByDate<T extends { date: string }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Extracts all unique tags from an array of blog posts
 * @param posts - Array of Blog objects
 * @returns Sorted array of unique tags
 */
export function getAllTagsFromPosts(posts: Blog[]): string[] {
  const tags = new Set<string>();

  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        tags.add(tag);
      });
    }
  });

  return Array.from(tags).sort();
}

/**
 * Filters posts by a specific tag
 * @param posts - Array of Blog objects
 * @param tag - Tag to filter by
 * @returns Filtered array of Blog objects containing the specified tag
 */
export function filterPostsByTag(posts: Blog[], tag: string): Blog[] {
  return posts.filter((post) => post.tags && post.tags.includes(tag));
}
