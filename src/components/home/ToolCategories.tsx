import Link from "next/link";

const categories = [
  { name: "文本写作", href: "/category?group=text-writing" },
  { name: "图像", href: "/category?group=image" },
  { name: "视频", href: "/category?group=video" },
  { name: "代码/IT", href: "/category?group=code-it" },
  { name: "语音", href: "/category?group=voice" },
  { name: "商业", href: "/category?group=business" },
  { name: "营销", href: "/category?group=marketing" },
  { name: "AI检测", href: "/category?group=ai-detector" },
  { name: "聊天机器人", href: "/category?group=chatbot" },
  { name: "设计与艺术", href: "/category?group=design-art" },
  { name: "生活助手", href: "/category?group=life-assistant" },
  { name: "3D", href: "/category?group=3d" },
  { name: "教育", href: "/category?group=education" },
  { name: "提示词", href: "/category?group=prompt" },
  { name: "生产力", href: "/category?group=productivity" },
  { name: "其他", href: "/category?group=other" },
];

export function ToolCategories() {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="whitespace-nowrap px-4 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {category.name}
          </Link>
        ))}
        <Link
          href="/categories"
          className="whitespace-nowrap px-4 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          更多 +
        </Link>
      </div>
    </div>
  );
}
