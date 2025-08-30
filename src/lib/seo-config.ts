// SEO Configuration for AI Tools Directory
// Centralized SEO settings for consistent optimization across the site

export const seoConfig = {
  // Base site information
  siteName: "AI Tools Directory",
  siteUrl: "https://www.folioify.com",
  siteDescription:
    "Discover the world's largest collection of AI tools and software. Find the perfect AI solution for your business, creative projects, and productivity needs.",

  // Default metadata
  defaultTitle: "AI Tools Directory | Discover 1000+ Best AI Tools in 2025",
  titleTemplate: "%s | AI Tools Directory",

  // Core keywords for AI tools directory
  coreKeywords: [
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

  // Social media handles
  social: {
    twitter: "@aitoolsdirectory",
    facebook: "aitoolsdirectory",
    linkedin: "company/ai-tools-directory",
    youtube: "@aitoolsdirectory",
  },

  // Open Graph default images
  images: {
    ogImage: "/images/og-image.jpg",
    twitterImage: "/images/twitter-image.jpg",
    logo: "/logo.png",
  },

  // Structured data organization info
  organization: {
    name: "AI Tools Directory",
    url: "https://www.folioify.com",
    logo: "https://www.folioify.com/logo.png",
    description: "The world's largest directory of AI tools and software",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@folioify.com",
    },
  },

  // Category-specific SEO data
  categories: {
    "ai-writing-tools": {
      title: "Best AI Writing Tools in 2025 | Compare Features & Pricing",
      description:
        "Discover the top AI writing tools and software. Compare features, pricing, and user reviews. Find the perfect AI writing solution to boost your content creation.",
      keywords: [
        "AI writing tools",
        "AI content generators",
        "AI copywriting",
        "automated writing",
        "AI text generation",
      ],
    },
    "ai-image-generators": {
      title: "Best AI Image Generators in 2025 | Create Stunning Visuals",
      description:
        "Explore the top AI image generation tools. Create stunning visuals, artwork, and graphics with artificial intelligence. Compare features and pricing.",
      keywords: [
        "AI image generators",
        "AI art tools",
        "text to image",
        "AI graphics",
        "artificial intelligence art",
      ],
    },
    "ai-chatbots": {
      title: "Best AI Chatbots in 2025 | Customer Service & Support Tools",
      description:
        "Find the best AI chatbot solutions for customer service, support, and engagement. Compare features, integrations, and pricing of top AI chatbot platforms.",
      keywords: [
        "AI chatbots",
        "customer service bots",
        "AI customer support",
        "conversational AI",
        "chatbot platforms",
      ],
    },
    "ai-productivity-tools": {
      title: "Best AI Productivity Tools in 2025 | Boost Your Efficiency",
      description:
        "Discover AI-powered productivity tools to streamline your workflow. Find the best AI assistants, automation tools, and efficiency boosters.",
      keywords: [
        "AI productivity tools",
        "AI assistants",
        "workflow automation",
        "AI efficiency tools",
        "productivity AI",
      ],
    },
  },
};

// Helper function to generate category metadata
export function getCategoryMetadata(slug: string) {
  const categoryData =
    seoConfig.categories[slug as keyof typeof seoConfig.categories];

  if (categoryData) {
    return categoryData;
  }

  // Fallback for categories not in the config
  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Best ${formattedTitle} AI Tools in 2025`,
    description: `Discover the top ${formattedTitle.toLowerCase()} AI tools and software. Compare features, pricing, and user reviews. Find the perfect AI solution for ${formattedTitle.toLowerCase()}.`,
    keywords: [
      `${formattedTitle.toLowerCase()} AI tools`,
      `best ${formattedTitle.toLowerCase()} AI`,
      `AI ${formattedTitle.toLowerCase()} software`,
    ],
  };
}

// Helper function to generate JSON-LD structured data
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: seoConfig.organization,
  };
}

// Helper function to generate Organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...seoConfig.organization,
  };
}
