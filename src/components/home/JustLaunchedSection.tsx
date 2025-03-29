import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

// 模拟最新发布的工具数据
const justLaunchedTools = [
  {
    id: 1,
    name: "iFable",
    description: "你的个人动漫宇宙，由AI生成，每个角色都有自己的故事",
    imageUrl: "/images/tools/ifable.png",
    category: "AI故事写作",
    views: 4,
    url: "/tools/ifable",
  },
  {
    id: 2,
    name: "Ghibli Image Generator",
    description: "将图像转换为吉卜力风格的艺术",
    imageUrl: "/images/tools/ghibli-generator.png",
    category: "AI艺术生成器",
    subcategory: "AI动漫艺术",
    views: 0,
    url: "/tools/ghibli-generator",
  },
  {
    id: 3,
    name: "Ghibli Art AI",
    description: "从照片和文本创建神奇的吉卜力风格图像 - 免费且简单!",
    imageUrl: "/images/tools/ghibli-art-ai.png",
    category: "AI照片与图像生成器",
    views: 0,
    url: "/tools/ghibli-art-ai",
  },
  {
    id: 4,
    name: "Ghibli AI",
    description: "用于从照片或文本创建吉卜力风格艺术品的生成器",
    imageUrl: "/images/tools/ghibli-ai.png",
    category: "AI艺术生成器",
    views: 0,
    url: "/tools/ghibli-ai",
  },
];

export function JustLaunchedSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">最新发布</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {justLaunchedTools.map((tool) => (
          <div
            key={tool.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={tool.url} className="block">
              <div className="relative h-40 bg-gray-100">
                {tool.imageUrl && (
                  <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-2 h-2 mr-1"></span>
                  <span className="mr-4">--</span>
                  <span>👁 {tool.views}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-3 text-xs">
                  <span className="text-gray-500">{tool.category}</span>
                  {tool.subcategory && (
                    <span className="text-gray-500 ml-2">
                      • {tool.subcategory}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
