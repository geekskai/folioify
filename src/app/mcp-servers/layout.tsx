import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "MCP Servers Directory | AI Model Context Protocol Tools & Integrations",
  description:
    "Discover MCP (Model Context Protocol) servers and tools for AI integration. Find the best MCP servers for Claude, ChatGPT, and other AI models. Browse verified MCP tools for enhanced AI capabilities and workflow automation.",
  keywords: [
    "MCP servers",
    "Model Context Protocol",
    "AI MCP tools",
    "Claude MCP servers",
    "ChatGPT MCP integration",
    "AI model extensions",
    "MCP directory",
    "AI workflow tools",
    "AI integration tools",
    "MCP protocol tools",
  ],
  openGraph: {
    title: "MCP Servers Directory | AI Model Context Protocol Tools",
    description:
      "Discover MCP servers and tools for AI integration. Find the best MCP servers for Claude, ChatGPT, and other AI models.",
    type: "website",
    url: "https://www.folioify.com/mcp-servers",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Servers Directory | AI Model Context Protocol Tools",
    description:
      "Discover MCP servers and tools for AI integration. Find the best MCP servers for enhanced AI capabilities.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.folioify.com/mcp-servers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${inter.variable}`}>{children}</div>;
}
