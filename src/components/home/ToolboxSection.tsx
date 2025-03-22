import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// Mock data for tools
const tools = [
  {
    id: 1,
    name: "Letter",
    description: "Ad",
    image: "https://prototyprio.gumlet.io/strapi/5d2a89ca7b5d3ab6867e38d4bb87a35e.webp?w=828&q=70&format=avif&compress=true&dpr=1",
    link: "https://letter.so?ref=prototypr",
  },
  {
    id: 2,
    name: "Aider",
    description: "AI",
    image: "https://prototyprio.gumlet.io/strapi/fa73d00a35a40cf84f14e91fc0e025b1.png?w=828&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/aider",
  },
  {
    id: 3,
    name: "Trae",
    description: "AI",
    image: "https://prototyprio.gumlet.io/strapi/e5dcc0ebc9abf98405dbc5e2457aaf07.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/trae",
  },
  {
    id: 4,
    name: "Doing Design Right",
    description: "Course",
    image: "https://prototyprio.gumlet.io/strapi/3791d1490e43dae6513671d722335467.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/doing-design-right",
  },
  {
    id: 5,
    name: "Typr Editor",
    description: "Editing",
    image: "https://prototyprio.gumlet.io/strapi/b1f1098f2ac161fab1ef44ba445902d4.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/typr-editor",
  },
  {
    id: 6,
    name: "Feedback Wizard",
    description: "Figma",
    image: "https://prototyprio.gumlet.io/strapi/51785de0eced93791e5a680c8893041c.png?w=3840&q=70&format=avif&compress=true&dpr=1",
    link: "/toolbox/feedback-wizard",
  },
];

export function ToolboxSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Toolbox</h2>
          <p className="text-sm text-muted-foreground">New products, daily.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tools.map((tool) => (
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
                    <h3 className="font-medium text-sm group-hover:text-accent transition-colors">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/toolbox" className="text-sm text-accent hover:underline">
            View all tools
          </Link>
        </div>
      </div>
    </section>
  );
}
