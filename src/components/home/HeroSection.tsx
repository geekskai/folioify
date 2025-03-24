import { SearchBar } from "./SearchBar";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative py-16">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-3xl flex  justify-center gap-1 sm:text-5xl font-bold tracking-tight">
          Extend your AI agent with{" "}
          <span className="block text-purple-600">2,690</span> capabilities.
        </h1>

        <p className="text-base py-4 text-muted-foreground max-w-2xl mx-auto">
          Explore powerful MCP tools to expand your AI agent’s capabilities and
          scalability.
        </p>

        {/* 使用客户端搜索组件 */}
        <SearchBar />

        {/* 特色标签 */}
        {/* <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">安全下载</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">无需注册</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">免费使用</span>
          </div>
        </div> */}
      </div>

      {/* 装饰性元素 */}
      <div className="absolute right-0 top-1/4 z-0">
        <div className="w-16 h-16 bg-yellow-400 rounded-lg transform rotate-12 shadow-lg"></div>
      </div>
      <div className="absolute right-16 bottom-1/4 z-0">
        <div className="w-24 h-24 bg-blue-400 rounded-lg transform -rotate-6 shadow-lg"></div>
      </div>
      <div className="absolute right-32 top-1/2 z-0">
        <div className="w-12 h-12 bg-green-400 rounded-lg transform rotate-45 shadow-lg"></div>
      </div>
      <div className="absolute right-8 bottom-8 z-0">
        <div className="w-10 h-10 bg-pink-300 rounded-full shadow-lg"></div>
      </div>

      {/* 左侧装饰元素 */}
      <div className="absolute left-10 top-1/3 z-0 hidden md:block">
        <div className="w-14 h-14 bg-purple-300 rounded-lg transform rotate-12 shadow-lg"></div>
      </div>
      <div className="absolute left-24 bottom-1/3 z-0 hidden md:block">
        <div className="w-10 h-10 bg-indigo-300 rounded-full shadow-lg"></div>
      </div>
    </section>
  );
}
