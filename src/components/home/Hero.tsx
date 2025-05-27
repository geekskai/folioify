import { SearchBar } from "./SearchBar";
import { HeroSection } from "./HeroSection";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-white md:py-24">
      <HeroSection />

      {/* 右侧装饰性元素 */}
      <div className="absolute right-10 top-1/3 z-0 hidden md:block">
        <div className="w-16 h-16 bg-blue-400 rounded-lg"></div>
      </div>
      <div className="absolute right-24 top-1/2 z-0 hidden md:block">
        <div className="w-12 h-12 bg-green-400 rounded-lg"></div>
      </div>
      <div className="absolute right-8 top-1/2 z-0 hidden md:block">
        <div className="w-14 h-14 bg-yellow-400 rounded-lg"></div>
      </div>
    </section>
  );
}
