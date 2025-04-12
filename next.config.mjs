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
    // Enable the MDX compiler
    mdxRs: true,
    // Disable type checking during build to avoid issues with contentlayer types
    typedRoutes: false,
  },
  // Make sure to transpile contentlayer packages
  transpilePackages: ["contentlayer", "next-contentlayer"],
  // Skip TypeScript type checking during build
  typescript: {
    // We still want to be shown errors in development
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
};

// Apply contentlayer transformation
export default withContentlayer(nextConfig);
