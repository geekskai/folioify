import { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { BlogList } from "@/components/blog/BlogList";
import { sortBlogPostsByDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog - Latest Articles and Tutorials",
  description:
    "Discover our latest articles, tutorials, and insights on web development, design, and technology.",
};

export default function BlogPage() {
  // Filter published posts and sort by date
  const posts = sortBlogPostsByDate(
    allBlogs.filter((post) => post.published !== false)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover our latest articles, tutorials, and insights on web
          development, design, and technology.
        </p>
      </header>

      <main>
        {posts.length > 0 ? (
          <BlogList posts={posts} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">
              No posts published yet. Check back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
