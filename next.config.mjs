import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "prototyprio.gumlet.io",
      "prototyprwp.gumlet.io",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prototyprio.gumlet.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prototyprwp.gumlet.io",
        pathname: "/**",
      },
    ],
  },
  // Update experimental configuration for Next.js 15
  experimental: {
    // Remove serverExternalPackages - it's no longer needed in Next.js 15
    // Use the contentLayerConfig option provided by the contentlayer package
    mdxRs: true, // Enable the new MDX-RS compiler
  },
  // Make sure to transpile contentlayer packages
  transpilePackages: ["contentlayer", "next-contentlayer"],
};

// Apply contentlayer transformation
export default withContentlayer(nextConfig);
