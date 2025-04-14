import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Folioify Clone | Design Tools and Community",
  description:
    "Folioify is a platform for designers to find tools, share articles, and connect with the global design community.",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${inter.variable}`}>{children}</div>;
}
