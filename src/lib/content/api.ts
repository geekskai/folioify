import { allBlogs } from "contentlayer/generated";
import { Blog } from "contentlayer/generated";

// Safe wrapper for accessing blog data
export function getAllBlogPosts() {
  try {
    return allBlogs.filter((post) => post.published !== false);
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string) {
  try {
    return allBlogs.find(
      (post) => post.slug === slug && post.published !== false
    );
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

export function getBlogSlugs() {
  try {
    return getAllBlogPosts().map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error getting blog slugs:", error);
    return [];
  }
}

// Get all available tags
export function getAllTags() {
  try {
    const posts = getAllBlogPosts();
    const tagsSet = new Set<string>();

    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet);
  } catch (error) {
    console.error("Error getting all tags:", error);
    return [];
  }
}

// Get blog posts by tag
export function getBlogPostsByTag(tag: string) {
  try {
    const posts = getAllBlogPosts();
    return posts.filter(
      (post) =>
        post.tags &&
        Array.isArray(post.tags) &&
        post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    console.error(`Error getting posts with tag ${tag}:`, error);
    return [];
  }
}

// Safe function to get MDX content
export function getMDXContent(post: Blog | null) {
  if (!post || !post.body) {
    return "";
  }

  try {
    return post.body.raw || "";
  } catch (error) {
    console.error("Error getting MDX content:", error);
    return "";
  }
}
