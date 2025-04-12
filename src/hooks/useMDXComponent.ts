import React, { useMemo } from "react";

// Custom implementation of useMDXComponent that works better with React 18 and Next.js 15
export function useMDXComponent(code: string) {
  return useMemo(() => {
    if (!code || typeof code !== "string") {
      console.warn("Invalid MDX code provided to useMDXComponent");
      return null;
    }

    try {
      // Create a simple MDX component for development
      const MDXComponent = ({ components = {} }) => {
        // This is a safe fallback if the code is not valid
        if (!code) {
          return React.createElement("div", null, "No content available");
        }

        // For development/preview, render the full MDX content instead of just 500 chars
        return React.createElement("div", {
          className: "mdx-placeholder",
          style: { whiteSpace: "pre-wrap" },
          dangerouslySetInnerHTML: {
            __html: `<div class="mdx-preview-notice">MDX Preview (Development Mode)</div>
                    <pre>${code}</pre>`,
          },
        });
      };

      MDXComponent.displayName = "MDXContent";
      return MDXComponent;
    } catch (error) {
      console.error("Error in useMDXComponent:", error);
      return null;
    }
  }, [code]);
}

// This is a fallback export to ensure compatibility
export default useMDXComponent;
