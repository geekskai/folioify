"use client";

import { useState, useEffect } from "react";

export default function TestLogo() {
  const [testUrlStatus, setTestUrlStatus] = useState<string>("Loading...");
  const logoUrl = "https://geekskai.com/static/images/geekskai-blog.png";

  useEffect(() => {
    const img = new Image();
    img.onload = () => setTestUrlStatus("Image loaded successfully");
    img.onerror = () => setTestUrlStatus("Image failed to load");
    img.src = logoUrl;
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Logo Test Page</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Status: {testUrlStatus}</h2>
        <p className="mb-2">URL: {logoUrl}</p>
      </div>

      <div className="flex gap-8">
        <div className="border p-4">
          <h2 className="mb-2">Using Standard Img Tag</h2>
          <img
            src={logoUrl}
            alt="Test Logo"
            width={200}
            height={200}
            className="border"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
            }}
          />
        </div>

        <div className="border p-4">
          <h2 className="mb-2">Using Next.js Image (unoptimized)</h2>
          <div className="w-[200px] h-[200px] border flex items-center justify-center overflow-hidden">
            {/* 使用一个简单的div替代，我们不使用Next.js Image组件 */}
            <div className="relative w-full h-full">
              <img
                src={logoUrl}
                alt="Test Logo"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="border p-4">
          <h2 className="mb-2">Using background-image</h2>
          <div
            className="w-[200px] h-[200px] border bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${logoUrl})` }}
          />
        </div>
      </div>
    </div>
  );
}
