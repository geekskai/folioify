import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Folioify specific colors
        folioify: {
          red: "hsl(var(--folioify-red))",
          blue: "hsl(var(--folioify-blue))",
          yellow: "hsl(var(--folioify-yellow))",
          green: "hsl(var(--folioify-green))",
          pink: "hsl(var(--folioify-pink))",
          lightBlue: "hsl(var(--folioify-light-blue))",
          beige: "hsl(var(--folioify-beige))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            code: {
              color: "var(--tw-prose-code)",
              fontWeight: "500",
              fontFamily:
                'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
              "&::before": { content: "none" },
              "&::after": { content: "none" },
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.25em",
              padding: "0.2em 0.4em",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            pre: {
              color: "var(--tw-prose-pre-code)",
              backgroundColor: "hsl(var(--code-bg))",
              borderRadius: "0.375rem",
              padding: "1.25rem",
              overflowX: "auto",
              fontFamily:
                'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
              fontSize: "0.875em",
            },
            "pre code": {
              backgroundColor: "transparent",
              borderWidth: "0",
              borderRadius: "0",
              padding: "0",
              fontWeight: "inherit",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
            },
            table: {
              width: "100%",
              tableLayout: "auto",
              textAlign: "left",
              marginTop: "2em",
              marginBottom: "2em",
            },
            "table th, table td": {
              padding: "0.75rem",
              borderWidth: "1px",
              borderColor: "hsl(var(--border))",
            },
            "table th": {
              backgroundColor: "hsl(var(--muted))",
              fontWeight: "600",
            },
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typographyPlugin],
} satisfies Config;
