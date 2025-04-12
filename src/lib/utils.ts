import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Blog } from "contentlayer/generated";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function sortBlogPostsByDate<T extends { date: string }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

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

export function filterPostsByTag(posts: Blog[], tag: string): Blog[] {
  return posts.filter((post) => post.tags && post.tags.includes(tag));
}
