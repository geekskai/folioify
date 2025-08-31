import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools Directory | Discover 10000+ Best AI Tools & Software",
  description:
    "Browse our comprehensive directory of AI tools and software. Find the perfect AI solution for your business, creative projects, and productivity needs. Compare features, pricing, and reviews of verified AI tools.",
  keywords: [
    "AI tools directory",
    "AI software catalog",
    "best AI tools",
    "AI tools comparison",
    "artificial intelligence tools",
    "AI productivity tools",
    "business AI tools",
    "AI automation software",
    "machine learning tools",
    "AI writing tools",
    "AI image generators",
    "AI chatbots directory",
  ],
  openGraph: {
    title: "AI Tools Directory | Discover 10000+ Best AI Tools & Software",
    description:
      "Browse our comprehensive directory of AI tools and software. Find the perfect AI solution for your needs.",
    type: "website",
    url: "https://www.folioify.com/toolbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | Discover 10000+ Best AI Tools & Software",
    description:
      "Browse our comprehensive directory of AI tools and software. Find the perfect AI solution for your needs.",
  },
};

// Mock data for categories
const categories = [
  { id: 1, name: "AI", link: "/toolbox/ai/page/1" },
  { id: 2, name: "UI", link: "/toolbox/ui/page/1" },
  { id: 3, name: "UX", link: "/toolbox/ux-tools/page/1" },
  { id: 4, name: "Plugins", link: "/toolbox/plugins/page/1" },
  { id: 5, name: "Prototyping", link: "/toolbox/prototyping/page/1" },
  {
    id: 6,
    name: "Mixed Reality",
    link: "/toolbox/augmented-reality-tools/page/1",
  },
  { id: 7, name: "Chat", link: "/toolbox/conversational-design-tools/page/1" },
];

// Mock data for tools (reusing the same tools from the homepage)
const tools = [
  {
    id: 1,
    name: "Letter",
    description: "Ad",
    image:
      "https://prototyprio.gumlet.io/strapi/5d2a89ca7b5d3ab6867e38d4bb87a35e.webp?w=828&q=70&format=avif&compress=true&dpr=1",
    link: "https://letter.so?ref=folioify",
  },
  {
    id: 2,
    name: "Aider",
    description: "AI",
    image:
      "https://prototyprio.gumlet.io/strapi/fa73d00a35a40cf84f14e91fc0e025b1.png?w=828&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/aider",
  },
  {
    id: 3,
    name: "Trae",
    description: "AI",
    image:
      "https://prototyprio.gumlet.io/strapi/e5dcc0ebc9abf98405dbc5e2457aaf07.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/trae",
  },
  {
    id: 4,
    name: "Doing Design Right",
    description: "Course",
    image:
      "https://prototyprio.gumlet.io/strapi/3791d1490e43dae6513671d722335467.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/doing-design-right",
  },
  {
    id: 5,
    name: "Typr Editor",
    description: "Editing",
    image:
      "https://prototyprio.gumlet.io/strapi/b1f1098f2ac161fab1ef44ba445902d4.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/typr-editor",
  },
  {
    id: 6,
    name: "Feedback Wizard",
    description: "Figma",
    image:
      "https://prototyprio.gumlet.io/strapi/51785de0eced93791e5a680c8893041c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/feedback-wizard",
  },
  {
    id: 7,
    name: "Claude Artifacts",
    description: "AI",
    image:
      "https://prototyprio.gumlet.io/strapi/42a8e5aac04eb9c65ff7ff038067866e.webp?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/claude-artifacts",
  },
  {
    id: 8,
    name: "daily.dev",
    description: "Developer",
    image:
      "https://prototyprio.gumlet.io/strapi/cfd16fc82c839aea570dd978ad5f152a.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/dailydev",
  },
];

export default function ToolboxPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <section className="relative mb-12 pb-12 border-b">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the AI tool,{" "}
              <span className="relative">
                transform your work.
                <span className="absolute bottom-0 left-0 w-full h-1 bg-folioify-blue"></span>
              </span>
            </h1>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search 1000s of AI tools..."
                className="pl-10 pr-4 py-6 text-lg rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-8">
            <Link href="/toolbox/obsidian-canvas" className="group">
              <Card className="h-full p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-sm font-medium">Obsidian Canvas</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visualize ideas
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/toolbox/bloom-objects" className="group">
              <Card className="h-full p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h3 className="text-sm font-medium">Bloom Objects</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    3D illustrations
                  </p>
                </div>
              </Card>
            </Link>
            <Link
              href="/toolbox/microsoft-bing-image-creator"
              className="group"
            >
              <Card className="h-full p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <h3 className="text-sm font-medium">Bing Image Creator</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI images
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/toolbox/stark" className="group">
              <Card className="h-full p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-3xl">♿</span>
                  </div>
                  <h3 className="text-sm font-medium">Stark</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accessibility
                  </p>
                </div>
              </Card>
            </Link>
            <Link
              href="/toolbox/the-design-system-encyclopedia"
              className="group"
            >
              <Card className="h-full p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-sm font-medium">Design Encyclopedia</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Design system
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Categories</h2>
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <Link
                    href={category.link}
                    className="text-sm text-accent hover:underline"
                  >
                    See all
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {tools.slice(0, 6).map((tool) => (
                    <Link key={tool.id} href={tool.link} className="group">
                      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
                        <div className="p-4 h-full flex flex-col">
                          <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-background">
                            <Image
                              src={tool.image}
                              alt={tool.name}
                              fill
                              className="object-cover object-center transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="mt-auto">
                            <h3 className="font-medium text-sm group-hover:text-accent transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 bg-secondary rounded-lg relative overflow-hidden">
          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-2/3 space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Get a weekly list of the best AI tools
                </h2>
                <p className="text-muted-foreground">
                  Join 25,000+ professionals who stay ahead with the latest AI
                  tools, reviews, and productivity insights delivered to your
                  inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 h-10 cursor-pointer hover:bg-secondary/80"
                  >
                    Subscribe
                  </Badge>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                <div className="relative w-40 h-40">
                  <Image
                    src="https://ext.same-assets.com/2743906655/1805010337.png"
                    alt="Folioify Robot"
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
