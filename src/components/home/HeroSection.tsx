import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative py-12">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight mb-4">
          Discover The Best AI Websites & Tools
        </h1>

        <p className="text-sm md:text-base py-3 md:py-4 text-muted-foreground max-w-2xl mx-auto">
          <span className="font-bold text-indigo-600">25142</span> AIs and{" "}
          <span className="font-bold text-indigo-600">233</span>
          categories in the best AI tools directory.
        </p>

        <SearchBar />
      </div>

      {/* 装饰性元素 - 移动端隐藏部分元素，调整尺寸 */}
      <div className="absolute right-0 top-1/4 z-0 hidden sm:block">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-yellow-400 rounded-lg transform rotate-12 shadow-lg"></div>
      </div>
      <div className="absolute right-8 sm:right-16 bottom-1/4 z-0 hidden sm:block">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-400 rounded-lg transform -rotate-6 shadow-lg"></div>
      </div>
      <div className="absolute right-20 sm:right-32 top-1/2 z-0 hidden sm:block">
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-400 rounded-lg transform rotate-45 shadow-lg"></div>
      </div>
      <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 hidden sm:block z-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-300 rounded-full shadow-lg"></div>
      </div>

      {/* 左侧装饰元素 - 仅在中等屏幕以上显示 */}
      <div className="absolute left-10 top-1/3 z-0 hidden md:block">
        <div className="w-14 h-14 bg-purple-300 rounded-lg transform rotate-12 shadow-lg"></div>
      </div>
      <div className="absolute left-24 bottom-1/3 z-0 hidden md:block">
        <div className="w-10 h-10 bg-indigo-300 rounded-full shadow-lg"></div>
      </div>
    </section>
  );
}
