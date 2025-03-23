import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createClient } from "@/db/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function ToolboxSection() {
  // 如果需要从数据库获取数据，可以保留这部分代码
  // 否则可以直接使用上面定义的tools数组
  const supabase = createClient();
  const { data: featuredList, error } = await supabase
    .from("MCP_Featured_List")
    .select("*");

  // 使用本地数据或数据库数据
  const displayTools = featuredList || [];
  const totalCount = displayTools.length;

  return (
    <section className="py-8 md:py-12">
      {/* 头部区域 */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Featured</h2>
            {totalCount > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {totalCount}
              </span>
            )}
            <Link
              href="/toolbox"
              className="text-xs text-gray-500 hover:text-gray-700 ml-2"
            >
              View all
            </Link>
          </div>

          <div className="flex gap-2">
            <button
              className="p-1 rounded-md bg-gray-100 opacity-50 cursor-not-allowed"
              disabled
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="p-1 rounded-md bg-gray-100 opacity-50 cursor-not-allowed"
              disabled
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTools.map((tool) => (
            <Link key={tool.id} href={tool.server || "#"} className="group">
              <Card className="overflow-hidden h-full transition-all hover:shadow-md bg-white rounded-xl border border-gray-100">
                <div className="p-5 h-full  justify-between flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-center gap-1">
                      <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                        <Image
                          src={tool.icon}
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
                    <div className="flex  justify-end items-center gap-1">
                      <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-activity h-3 w-3"
                        >
                          <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-sm text-gray-900">
                        {tool.count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{tool.server}</span>

                    <button data-state="closed">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {tool.descript}
                  </p>
                  <div className="text-right">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">
                      GET
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
