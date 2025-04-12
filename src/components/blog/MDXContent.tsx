"use client";

// Use our custom implementation instead of the contentlayer one
import { useMDXComponent } from "@/hooks/useMDXComponent";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Custom components for MDX
const CustomImage = (props: {
  src?: string;
  alt?: string;
  [key: string]: unknown;
}) => (
  <Image
    src={props.src || ""}
    alt={props.alt || ""}
    width={700}
    height={350}
    className="rounded-lg my-6"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 700px, 700px"
  />
);

const CustomLink = (props: {
  href?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) => {
  const { href, children, ...rest } = props;

  if (href && href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (href && (href.startsWith("http") || href.startsWith("mailto:"))) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};

// Define components object
const mdxComponents = {
  img: CustomImage,
  a: CustomLink,
};

interface MDXContentProps {
  code: string;
}

// Fallback content component
const FallbackContent = () => (
  <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
    <p className="text-gray-500">
      Unable to render content. Please try again later.
    </p>
  </div>
);

// Separate renderer component to avoid hooks issues
const MDXRenderer = ({ code }: { code: string }) => {
  // This component only runs on client
  const MDXComponent = useMDXComponent(code);

  if (!MDXComponent) {
    return <div className="text-gray-500">Content not available</div>;
  }

  return <MDXComponent components={mdxComponents} />;
};

// Use dynamic import with SSR disabled to ensure client-only rendering
const ClientOnlyMDX = dynamic(() => Promise.resolve(MDXRenderer), {
  ssr: false,
});

// Main wrapper component
export function MDXContent({ code }: MDXContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple error handling for missing code
  if (!code) {
    return <FallbackContent />;
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    );
  }

  // Use our custom renderer with error handling
  try {
    return (
      <div className="mdx-content">
        <ClientOnlyMDX code={code} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MDX:", error);
    return <FallbackContent />;
  }
}
