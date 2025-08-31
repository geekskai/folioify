import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Tools Directory | Discover 20000+ Best AI Tools in 2025",
    template: "%s | AI Tools Directory",
  },
  description:
    "Discover the world's largest collection of AI tools and software. Find the perfect AI solution for your business, creative projects, and productivity needs. Compare features, pricing, and reviews of 20000+ verified AI tools.",
  keywords: [
    "AI tools",
    "artificial intelligence software",
    "AI directory",
    "best AI tools 2025",
    "AI productivity tools",
    "machine learning tools",
    "AI writing tools",
    "AI image generators",
    "AI chatbots",
    "AI automation tools",
    "business AI tools",
    "free AI tools",
    "AI tools comparison",
    "AI software directory",
  ],
  authors: [{ name: "AI Tools Directory Team" }],
  creator: "AI Tools Directory",
  publisher: "AI Tools Directory",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.folioify.com/",
    siteName: "AI Tools Directory",
    title: "AI Tools Directory | Discover 20000+ Best AI Tools in 2025",
    description:
      "Discover the world's largest collection of AI tools and software. Find the perfect AI solution for your business, creative projects, and productivity needs.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Tools Directory - Discover the Best AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | Discover 20000+ Best AI Tools in 2025",
    description:
      "Discover the world's largest collection of AI tools and software. Find the perfect AI solution for your business needs.",
    images: ["/images/twitter-image.jpg"],
    creator: "@aitoolsdirectory",
  },
  alternates: {
    canonical: "https://www.folioify.com/",
  },
  category: "Technology",
  classification: "AI Tools Directory",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Tools Directory",
    description:
      "Discover the world's largest collection of AI tools and software. Find the perfect AI solution for your business, creative projects, and productivity needs.",
    url: "https://www.folioify.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.folioify.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Tools Directory",
      url: "https://www.folioify.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.folioify.com/logo.png",
      },
    },
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
