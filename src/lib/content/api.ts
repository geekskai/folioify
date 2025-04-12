import { Blog, allBlogs } from "contentlayer/generated";

/**
 * 获取所有已发布的博客文章
 */
export function getAllPublishedBlogs() {
  return allBlogs.filter((post) => post.published !== false);
}

/**
 * 根据slug获取博客文章
 */
export function getBlogPostBySlug(slug: string) {
  return allBlogs.find(
    (post) => post.slug === slug && post.published !== false
  );
}

/**
 * 获取所有博客文章的slug
 */
export function getBlogSlugs() {
  return allBlogs
    .filter((post) => post.published !== false)
    .map((post) => post.slug);
}

/**
 * 获取MDX内容
 */
export function getMDXContent(post: Blog | null) {
  if (!post || !post.body) {
    return "";
  }

  try {
    // 返回原始MDX内容
    return post.body.raw || "";
  } catch (error) {
    console.error("Error getting MDX content:", error);
    return "";
  }
}

// Get all available tags
export function getAllTags() {
  try {
    const posts = getAllPublishedBlogs();
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
    const posts = getAllPublishedBlogs();
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
