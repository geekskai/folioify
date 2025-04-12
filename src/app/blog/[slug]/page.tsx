import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/MDXContent";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/blog/Tag";
import Image from "next/image";
import {
  getBlogPostBySlug,
  getBlogSlugs,
  getMDXContent,
} from "@/lib/content/api";

// Define params type without using the PageProps interface
type PageParams = { slug: string };

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  // Await params to avoid Next.js 15 dynamic API sync issue
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到",
      description: "请求的博客文章不存在。",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${post.slug}`,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

// Make the component async to properly handle params
export default async function BlogPost({ params }: { params: PageParams }) {
  // Await params to avoid Next.js 15 dynamic API sync issue
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get MDX content safely
  const mdxContent = getMDXContent(post);

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2">•</span>
            <span>{post.readingTime?.text || "3 min read"}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          )}
          {post.cover && (
            <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
        </header>

        {/* Use raw MDX content in client component */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent code={mdxContent} />
        </div>
      </article>
    </div>
  );
}
