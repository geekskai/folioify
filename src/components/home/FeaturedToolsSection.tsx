import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

// 模拟特色工具数据
const featuredTools = [
  {
    id: 5,
    name: "Rubli AI",
    description:
      "Rubli: AI原生随机角色UGC平台。创建你的角色，分享故事，加入社区。",
    imageUrl: "/images/tools/rubli-ai.png",
    category: "AI角色",
    subcategory: "小说",
    views: 45,
    popularity: "475.0K",
    growthRate: "33.85%",
    url: "/tools/rubli-ai",
    featured: true,
  },
  {
    id: 6,
    name: "HackathonParty",
    description: "为实时黑客马拉松团队协作和支持的平台",
    imageUrl: "/images/tools/hackathon-party.png",
    category: "--",
    views: 1,
    popularity: "98.28%",
    url: "/tools/hackathon-party",
    featured: true,
  },
  {
    id: 7,
    name: "xAutoDM",
    description: "AI驱动的Twitter DM自动化，用于更高级的对话",
    imageUrl: "/images/tools/xautodm.png",
    category: "--",
    views: 0,
    url: "/tools/xautodm",
    featured: true,
  },
  {
    id: 8,
    name: "Reachfast",
    description: "使用LinkedIn URL查找直接联系详情",
    imageUrl: "/images/tools/reachfast.png",
    category: "1.3K",
    popularity: "100.00%",
    views: 0,
    url: "/tools/reachfast",
    featured: true,
  },
];

export function FeaturedToolsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">
        特色工具<sup>*</sup>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredTools.map((tool) => (
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
                  <span className="mr-4">{tool.category}</span>
                  <span>👁 {tool.views}</span>
                </div>
                {tool.popularity && (
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="mr-2">📈 {tool.popularity}</span>
                    {tool.growthRate && (
                      <span className="text-green-500">
                        ↑ {tool.growthRate}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tool.description}
                </p>
                {tool.subcategory && (
                  <div className="mt-3 text-xs">
                    <span className="text-gray-500">{tool.subcategory}</span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
