import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AI Tools Blog | Latest AI News, Reviews & Tutorials",
    template: "%s | AI Tools Blog",
  },
  description:
    "Stay updated with the latest AI tools, reviews, tutorials, and industry insights. Discover how artificial intelligence is transforming business, creativity, and productivity.",
  keywords: [
    "AI tools blog",
    "AI news",
    "AI tool reviews",
    "artificial intelligence tutorials",
    "AI industry insights",
    "machine learning news",
    "AI productivity tips",
    "AI business applications",
    "AI technology trends",
    "AI tool comparisons",
  ],
  openGraph: {
    title: "AI Tools Blog | Latest AI News, Reviews & Tutorials",
    description:
      "Stay updated with the latest AI tools, reviews, tutorials, and industry insights.",
    type: "website",
    url: "https://www.folioify.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Blog | Latest AI News, Reviews & Tutorials",
    description:
      "Stay updated with the latest AI tools, reviews, tutorials, and industry insights.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
  );
}
