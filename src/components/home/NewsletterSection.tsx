import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function NewsletterSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Get a weekly list of the best tools
            </h2>
            <p className="text-muted-foreground">
              Join 25,000+ creatives who enjoy a regular dose of inspiration and
              motivation, delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="relative w-40 h-40 md:w-56 md:h-56">
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
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0 flex">
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-folioify-lightBlue/30 opacity-50"></div>
          <div className="absolute top-20 left-1/4 w-12 h-12 rounded-full bg-folioify-yellow/30 opacity-50"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-folioify-pink/30 opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-14 h-14 rounded-full bg-folioify-blue/30 opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
