import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

// Mock data for featured articles
const articles = [
  {
    id: 1,
    title: "CodePen? AI Editors are like Pens for Code",
    description: "AI coding tools are revolutionizing how developers work with code",
    image: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    author: {
      name: "Graeme",
      avatar: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    },
    date: "Jan 25",
    tags: ["AI", "Code"],
    slug: "/post/ai-editor-aider-cursor",
  },
  {
    id: 2,
    title: "Just use Stripe directly. Your SaaS (probably) doesn't need a Merchant of Record",
    description: "Why you might not need a complex payment solution for your SaaS",
    image: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    author: {
      name: "Graeme",
      avatar: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    },
    date: "Oct 04",
    tags: ["SaaS", "Code"],
    slug: "/post/stripe-merchant-of-record",
  },
  {
    id: 3,
    title: "Cursor AI: Crafting Prompts and Instructions to Build Full Stack Apps",
    description: "How to use Cursor AI to build complex applications",
    image: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    author: {
      name: "Graeme",
      avatar: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    },
    date: "Sep 06",
    tags: ["AI", "developer"],
    slug: "/post/cursor-ai-prompts",
  },
];

export function FeaturedArticles() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">New Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={article.slug} className="group">
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-accent transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{article.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{article.date}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
