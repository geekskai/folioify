import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Folioify Newsletter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 25,000+ designers, developers, and creative professionals who
            receive our weekly curated digest of design tools, resources, and
            inspiration.
          </p>
        </div>

        <div className="bg-secondary rounded-lg p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-2/3 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Subscribe to our weekly newsletter
              </h2>
              <p className="text-muted-foreground">
                Every Thursday, we'll send you a handpicked selection of
                articles, tools, and resources to help you stay on top of design
                trends and boost your creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48">
                <Image
                  src="https://ext.same-assets.com/2743906655/1805010337.png"
                  alt="Folioify Robot"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What you'll receive</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-background rounded-lg p-6 border">
              <div className="mb-4 text-3xl">🔍</div>
              <h3 className="text-lg font-medium mb-2">Curated Content</h3>
              <p className="text-muted-foreground">
                Hand-picked articles, tutorials, and resources from around the
                web
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border">
              <div className="mb-4 text-3xl">🛠️</div>
              <h3 className="text-lg font-medium mb-2">Design Tools</h3>
              <p className="text-muted-foreground">
                The latest and most useful design and development tools
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border">
              <div className="mb-4 text-3xl">💡</div>
              <h3 className="text-lg font-medium mb-2">Inspiration</h3>
              <p className="text-muted-foreground">
                Inspiring websites, projects, and design ideas to spark
                creativity
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Previous Issues</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-muted p-6">
                  <span className="text-sm text-muted-foreground">
                    Issue #{50 - i} • March {i + 10}, 2025
                  </span>
                  <h3 className="text-xl font-medium mt-2">
                    {i === 1
                      ? "New AI design tools and accessibility trends"
                      : ""}
                    {i === 2 ? "Design systems and component libraries" : ""}
                    {i === 3 ? "Mobile UX patterns and typography tips" : ""}
                    {i === 4 ? "Color theory and design psychology" : ""}
                  </h3>
                </div>
                <div className="p-6 bg-background">
                  <Button variant="outline" className="w-full">
                    Read Issue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
