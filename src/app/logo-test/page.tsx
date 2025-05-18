"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LogoTestPage() {
  const [logoUrl, setLogoUrl] = useState(
    "https://www.folioify.com/images/logo.png"
  );
  const [imgError, setImgError] = useState(false);
  const [loadStatus, setLoadStatus] = useState("");

  const testLogo = () => {
    console.log("Testing logo URL:", logoUrl);
    setImgError(false);
    setLoadStatus("Loading...");

    const img = new Image();
    img.onload = () => {
      console.log("Logo loaded successfully:", logoUrl);
      setLoadStatus("Loaded successfully");
    };

    img.onerror = () => {
      console.log("Logo failed to load:", logoUrl);
      setLoadStatus("Failed to load");
      setImgError(true);
    };

    img.crossOrigin = "anonymous";
    img.src = logoUrl;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Logo Testing Page</h1>

      <div className="mb-6">
        <div className="flex gap-4 mb-2">
          <Input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Enter logo URL"
            className="flex-1"
          />
          <Button onClick={testLogo}>Test Logo</Button>
        </div>
        <p>Status: {loadStatus}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Method 1: Standard img tag */}
        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">Standard img tag</h2>
          <div className="w-24 h-24 border bg-white flex items-center justify-center">
            <img
              src={logoUrl}
              alt="Logo"
              onError={() => console.log("Standard img tag error")}
              onLoad={() => console.log("Standard img tag loaded")}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Method 2: Next.js Image component */}
        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">Next.js Image component</h2>
          <div className="w-24 h-24 border bg-white flex items-center justify-center">
            {logoUrl && (
              <div className="relative w-full h-full">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                  onError={() => console.log("Next.js Image error")}
                  onLoad={() => console.log("Next.js Image loaded")}
                  unoptimized
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Note: Domain must be in next.config.js
          </p>
        </div>

        {/* Method 3: CSS background image */}
        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">CSS background image</h2>
          <div
            className="w-24 h-24 border bg-white bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${logoUrl})` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h2 className="font-bold mb-2">Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Enter a logo URL in the input field and click "Test Logo"</li>
          <li>Check browser console for detailed loading information</li>
          <li>Compare the three different rendering methods</li>
          <li>
            For Next.js Image component to work, the domain must be added to
            next.config.js
          </li>
        </ul>
      </div>
    </div>
  );
}
