"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SubmitModalTrigger } from "@/components/submit";
// import { useToast } from "@/hooks/use-toast";

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "MCP Servers", href: "/mcp-servers" },
  // { label: "Prompts", href: "/prompts" },
  { label: "Blog", href: "/blog" },
  // { label: "Submit", href: "/submit" },
  // { label: "Newsletter", href: "/newsletter" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  // const { toast } = useToast();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              priority
              alt="Folioify Logo"
              width={48}
              height={48}
            />
            <span className="inline-block font-semibold text-xl">Folioify</span>
          </Link>

          <nav className="hidden md:flex gap-6 ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Submit Dialog */}
          <div className="hidden md:block ml-auto">
            <SubmitModalTrigger />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-4" />
                {/* Mobile Submit */}
                <SubmitModalTrigger />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
