import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex-col flex-wrap gap-4">
              <h3 className="text-lg font-medium mb-4">Get Folioify Weekly</h3>
              <p className="text-muted-foreground mb-4">
                Top articles and tools every week
              </p>
              <div className="flex w-full max-w-md items-center gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-sm"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground pt-4">
              © 2025 Folioify, All rights reserved.
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Good Stuff</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://twitter.com/folioify"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com/folioify"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Other Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://adobe.com/products/xd/adobe-fund.html"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Adobe Fund for Design
                </Link>
              </li>
              <li>
                <Link
                  href="https://grantfortheweb.org"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Grant for the Web
                </Link>
              </li>
              <li>
                <Link
                  href="https://interledger.org/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Web Monetization
                </Link>
              </li>
              <li>
                <Link
                  href="https://letter.so"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mail by Letter
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
