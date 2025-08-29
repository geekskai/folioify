import { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { BlogList } from "@/components/blog/BlogList";
import { sortBlogPostsByDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Tools Blog - Latest Articles, Reviews & Tutorials",
  description:
    "Discover our latest articles, reviews, and tutorials about AI tools, artificial intelligence trends, and productivity insights. Learn how to leverage AI for business and creative projects.",
  keywords: [
    "AI tools articles",
    "AI tool reviews",
    "artificial intelligence blog",
    "AI tutorials",
    "AI productivity guides",
    "machine learning insights",
    "AI business applications",
    "AI technology news",
  ],
  openGraph: {
    title: "AI Tools Blog - Latest Articles, Reviews & Tutorials",
    description:
      "Discover our latest articles, reviews, and tutorials about AI tools and artificial intelligence trends.",
    type: "website",
    url: "https://www.folioify.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Blog - Latest Articles, Reviews & Tutorials",
    description:
      "Discover our latest articles, reviews, and tutorials about AI tools and artificial intelligence trends.",
  },
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
