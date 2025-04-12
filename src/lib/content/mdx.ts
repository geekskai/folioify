import { bundleMDX } from "mdx-bundler";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Blog } from "contentlayer/generated";
import type { BuildOptions } from "esbuild";

// Define a minimal type for mdxOptions
interface MDXOptions {
  remarkPlugins?: unknown[];
  rehypePlugins?: unknown[];
}

/**
 * 从Blog对象中提取并处理MDX内容
 */
export async function processMDX(post: Blog | null) {
  if (!post || !post.body?.raw) {
    return { code: "", frontmatter: {} };
  }

  try {
    // 使用mdx-bundler处理MDX内容
    const { code, frontmatter } = await bundleMDX({
      source: post.body.raw,
      mdxOptions: (options: MDXOptions) => {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          rehypeHighlight,
        ];
        return options;
      },
      esbuildOptions: (options: BuildOptions) => {
        options.target = "es2020";
        return options;
      },
    });

    return { code, frontmatter };
  } catch (error) {
    console.error("Error processing MDX:", error);
    return { code: "", frontmatter: {} };
  }
}

/**
 * 从Blog对象中提取MDX内容
 */
export function extractMDXContent(post: Blog | null): string {
  if (!post || !post.body) {
    return "";
  }

  try {
    return post.body.raw || "";
  } catch (error) {
    console.error("Error extracting MDX content:", error);
    return "";
  }
}
