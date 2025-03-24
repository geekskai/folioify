import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ToolItem } from "./SectionList";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={
        tool.server
          ? `https://www.npmjs.com/search?q=${tool.server.replace("@", "")}`
          : `https://www.npmjs.com/search?q=${encodeURIComponent(tool.title)}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className="overflow-hidden h-full transition-all hover:shadow-md bg-white rounded-xl border border-gray-100">
        <div className="p-5 h-full justify-between flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-center gap-1">
              <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                <Image
                  src={tool.icon || "/placeholder-icon.png"}
                  alt={tool.title}
                  width={24}
                  height={24}
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="font-medium text-md text-gray-900">
                {tool.title}
              </h3>
            </div>
            <div className="flex justify-end items-center gap-1">
              <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-activity h-3 w-3"
                >
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                </svg>
              </div>
              <span className="font-medium text-sm text-gray-900">
                {tool.count || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>
              {tool.server ||
                "@" + (tool.title?.toLowerCase().replace(/\s+/g, "-") || "")}
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <p className="text-xs text-gray-500 line-clamp-3">{tool.descript}</p>
          <div className="text-right">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">
              GET
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
