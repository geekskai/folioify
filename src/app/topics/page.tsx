import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for topics
const featuredTopics = [
  { id: 1, name: "Accessibility", path: "/topic/accessibility/page/1" },
  { id: 2, name: "AI", path: "/topic/ai/page/1" },
  { id: 3, name: "Branding", path: "/topic/branding/page/1" },
  { id: 4, name: "Figma", path: "/topic/figma/page/1" },
  { id: 5, name: "Notion", path: "/topic/notion/page/1" },
  { id: 6, name: "Interview", path: "/topic/interview/page/1" },
  { id: 7, name: "Open Source", path: "/topic/open-source/page/1" },
  { id: 8, name: "Psychology", path: "/topic/design-psychology/page/1" },
  { id: 9, name: "UI", path: "/topic/ui/page/1" },
  { id: 10, name: "UX", path: "/topic/ux/page/1" },
  { id: 11, name: "User Research", path: "/topic/user-research/page/1" },
  { id: 12, name: "Career", path: "/topic/career/page/1" },
];

// Mock data for topic sections
const topicSections = [
  {
    id: 1,
    name: "Accessibility",
    path: "/topic/accessibility/page/1",
    posts: [
      {
        id: 1,
        title: "Design in 2022: Language, Localisation and Collaboration",
        image: "https://prototyprio.gumlet.io/wp-content/uploads/2022/04/header.jpeg?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Sophie",
          avatar: "https://prototyprwp.gumlet.io/wp-content/uploads/2020/06/IMG_8390_Facetune_10-11-2018-20-08-03.jpeg?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Apr 12",
        path: "/post/design-in-2022-language-localisation-and-collaboration",
      },
      {
        id: 2,
        title: "Twitter reminds us about Alt Text, but how good are we at it?",
        image: "https://prototyprio.gumlet.io/strapi/e0ccf611c2ce2213a19d46f6dd779e37.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Slava",
          avatar: "https://prototyprio.gumlet.io/strapi/f8eecba6a3c4c88f762f46311d9a7c44.jpg?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Oct 31",
        path: "/post/twitter-reminds-us-about-alt-text-but-how-good-are-we-at-it",
      },
      {
        id: 3,
        title: "Designing localisation-friendly products",
        image: "https://prototyprio.gumlet.io/wp-content/uploads/2022/03/im1.jpeg?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Cassandra",
          avatar: "https://prototyprio.gumlet.io/wp-content/uploads/2022/04/1N756t74dpMhta4LJD1ilfQ-150x150.jpeg?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Apr 19",
        path: "/post/designing-localisation-friendly-products",
      },
      {
        id: 4,
        title: "How to use huge type on the web",
        image: "https://prototyprio.gumlet.io/strapi/44e5b81b685fc009ed5ecc9f125d7501.webp?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Matej",
          avatar: "https://prototyprio.gumlet.io/strapi/f1e61c77b98ae2dc0413e46878d8e651.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Nov 24",
        path: "/post/how-to-use-huge-type-on-the-web",
      },
    ],
  },
  {
    id: 2,
    name: "AI",
    path: "/topic/ai/page/1",
    posts: [
      {
        id: 1,
        title: "Adobe MAX Sneaks 2022: Every AI Experiment, and its Developer",
        image: "https://prototyprio.gumlet.io/strapi/0503e6842c24c2c0286df03aac617b7d.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Rob",
          avatar: "https://prototyprio.gumlet.io/strapi/4665856c29904032f10629756af15ed0.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Oct 19",
        path: "/post/adobe-ai-max-sneaks-2022",
      },
      {
        id: 2,
        title: "Microsoft Designer: AI Prompt Design Principles",
        image: "https://prototyprio.gumlet.io/strapi/f5e2f0cd67f899d4e42b922166398733.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Graeme",
          avatar: "https://prototyprio.gumlet.io/strapi/c779fc33f030a12af9290639c0ab725c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Dec 23",
        path: "/post/microsoft-designer-ai-prompt-design-principles",
      },
      {
        id: 3,
        title: "Your hand as a mouse - exploring hand gesture interaction (1)",
        image: "https://prototyprio.gumlet.io/strapi/5fc5180994ae2c090e0c494d92fc9466.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Seungmee",
          avatar: "https://prototyprio.gumlet.io/strapi/0b4fe27a5a67df1bf643a9e6a0c593ce.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Nov 21",
        path: "/post/your-hand-as-a-mouse-exploring-hand-gesture-interaction-1",
      },
      {
        id: 4,
        title: "7 Great AI Opportunities for Any App Startup, by ChatGPT",
        image: "https://prototyprio.gumlet.io/strapi/9a620488e62ef62444d21e3b38eaf744.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        author: {
          name: "Minal",
          avatar: "https://prototyprio.gumlet.io/strapi/cfcc2b1169ee021ee8cb9d5b50b713cb.png?w=3840&q=70&format=avif&compress=true&dpr=1",
        },
        date: "Dec 14",
        path: "/post/chatpgt-7-startup-ai-opportunities",
      },
    ],
  },
];

// List of A-Z topics
const allTopics = [
  { id: 1, name: "3D", path: "/topic/3d/page/1" },
  { id: 2, name: "Accessibility", path: "/topic/accessibility/page/1" },
  { id: 3, name: "Adobe", path: "/topic/adobe/page/1" },
  { id: 4, name: "Adobe XD", path: "/topic/adobe-xd/page/1" },
  { id: 5, name: "AI", path: "/topic/ai/page/1" },
  { id: 6, name: "AI-Powered", path: "/topic/ai-powered/page/1" },
  { id: 7, name: "Airtable", path: "/topic/airtable/page/1" },
  { id: 8, name: "Algorithms", path: "/topic/algorithms/page/1" },
  { id: 9, name: "Animation", path: "/topic/animation/page/1" },
  { id: 10, name: "Apps", path: "/topic/apps/page/1" },
  { id: 11, name: "Artificial Intelligence", path: "/topic/artificial-intelligence/page/1" },
  { id: 12, name: "Artwork", path: "/topic/artwork/page/1" },
];

export default function TopicsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="flex flex-wrap gap-2 mb-10">
          {featuredTopics.map((topic) => (
            <Link key={topic.id} href={topic.path}>
              <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-secondary transition-colors">
                {topic.name}
              </Badge>
            </Link>
          ))}
        </div>

        {topicSections.map((section) => (
          <section key={section.id} className="mb-16">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              <Link href={section.path} className="ml-auto text-sm text-accent hover:underline">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.posts.map((post) => (
                <Link key={post.id} href={post.path} className="group">
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-4 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{post.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="font-medium mb-2 text-sm text-muted-foreground">Localization</h3>
              <p className="text-sm text-muted-foreground mb-4">Designing and building for different languages and cultural backgrounds.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-sm text-muted-foreground">Web Monetization</h3>
              <p className="text-sm text-muted-foreground mb-4">A new way to send money on the web with micropayments.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">The A-Z</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allTopics.map((topic) => (
              <Link key={topic.id} href={topic.path}>
                <Card className="hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-muted-foreground">→</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
