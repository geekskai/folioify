/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "prototyprio.gumlet.io",
      "prototyprwp.gumlet.io",
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
};

export default nextConfig;
