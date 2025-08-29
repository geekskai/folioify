import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.folioify.com";

  // Static pages with high priority for AI tools directory
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toolbox`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mcp-servers`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Popular AI tool categories for better SEO
  const aiCategories = [
    "ai-writing-tools",
    "ai-image-generators",
    "ai-chatbots",
    "ai-automation-tools",
    "ai-productivity-tools",
    "ai-video-tools",
    "ai-audio-tools",
    "ai-code-assistants",
    "ai-design-tools",
    "ai-analytics-tools",
    "text-writing",
    "image-generation",
    "business-intelligence",
    "customer-support",
    "content-creation",
    "data-analysis",
    "marketing-automation",
    "social-media-management",
  ];

  const categoryPages = aiCategories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
