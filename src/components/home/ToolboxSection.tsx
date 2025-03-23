import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createClient } from "@/db/supabase/client";

export async function ToolboxSection() {
  // 如果需要从数据库获取数据，可以保留这部分代码
  // 否则可以直接使用上面定义的tools数组
  const supabase = createClient();
  const { data: featuredList, error } = await supabase
    .from("MCP_Featured_List")
    .select("*");

  // 使用本地数据或数据库数据
  const displayTools = featuredList || [];

  return (
    <section className="py-8 md:py-12 bg-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTools.map((tool) => (
            <Link key={tool.id} href={tool.server || "#"} className="group">
              <Card className="overflow-hidden h-full transition-all hover:shadow-md bg-white rounded-xl border border-gray-100">
                <div className="p-5 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src={tool.icon}
                        alt={tool.title}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900 mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3">
                        {tool.descript}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-2 text-right">
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
