"use client";

import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added elements during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";

    // Remove LastPass elements that might cause hydration issues
    const removeLastPassElements = () => {
      const lastPassElements = document.querySelectorAll(
        "[data-lastpass-icon-root]"
      );
      lastPassElements.forEach((element) => {
        element.remove();
      });
    };

    // Run immediately
    removeLastPassElements();

    // Also run when DOM changes to catch delayed injections
    const observer = new MutationObserver(() => {
      removeLastPassElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      <Layout>{children}</Layout>
      <Toaster />
    </body>
  );
}
