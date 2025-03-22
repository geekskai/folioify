import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="absolute inset-0 z-0 prototypr-grid"></div>
      <div className="container relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-xl">
              Everything is a<br />prototype
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-md">
              Start something new. Write a draft, design an app, curate inspiration. Life is a prototype, share your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/onboard">
                  Get started
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <Image
                src="https://ext.same-assets.com/2743906655/2077970845.png"
                alt="Prototypr Hero"
                width={400}
                height={400}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
