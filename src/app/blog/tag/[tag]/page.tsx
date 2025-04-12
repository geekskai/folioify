import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog/BlogList";
import { sortBlogPostsByDate } from "@/lib/utils";
import { getAllTags, getBlogPostsByTag } from "@/lib/content/api";

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();

  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.toLowerCase()),
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  // Await params to avoid Next.js 15 dynamic API sync issue
  const resolvedParams = await Promise.resolve(params);
  const tagParam = decodeURIComponent(resolvedParams.tag);

  return {
    title: `#${tagParam} - Blog Posts`,
    description: `All blog posts tagged with #${tagParam}`,
    openGraph: {
      title: `#${tagParam} - Blog Posts`,
      description: `All blog posts tagged with #${tagParam}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  // Await params to avoid Next.js 15 dynamic API sync issue
  const resolvedParams = await Promise.resolve(params);
  const tagParam = decodeURIComponent(resolvedParams.tag);
  const allTags = getAllTags();

  // Find the correct case for the tag
  const matchedTag = allTags.find(
    (t) => t.toLowerCase() === tagParam.toLowerCase()
  );

  if (!matchedTag) {
    notFound();
  }

  const posts = sortBlogPostsByDate(getBlogPostsByTag(matchedTag));

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Posts tagged with{" "}
          <span className="text-indigo-600">#{matchedTag}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Found {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
      </header>

      <main>
        <BlogList posts={posts} showTags={false} />
      </main>
    </div>
  );
}
