import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createClient } from "@/db/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "@/db/supabase/types";

// 定义工具项的通用类型
type ToolItem = {
  id: number;
  icon?: string;
  title: string;
  count?: string | number;
  server?: string;
  descript?: string;
};

// 定义部分显示的类型
type SectionData = {
  id: string;
  title: string;
  data: ToolItem[];
  count: number;
};

export async function ToolboxSection() {
  const supabase = createClient();

  // 获取所有表格数据
  const { data: featuredList, error: featuredError } = await supabase
    .from("MCP_Featured_List")
    .select("*");

  const { data: aiNoteData, error: aiNoteError } = await supabase
    .from("MCP_AI_Note_Management")
    .select("*");

  const { data: applicationData, error: applicationError } = await supabase
    .from("MCP_Application_Integration_Tools")
    .select("*");

  const { data: browserData, error: browserError } = await supabase
    .from("MCP_Browser_Automation")
    .select("*");

  const { data: dataAppData, error: dataAppError } = await supabase
    .from("MCP_Data_and_App_Ecosystems")
    .select("*");

  const { data: gitWorkflowData, error: gitWorkflowError } = await supabase
    .from("MCP_Git_Workflow_Management")
    .select("*");

  const { data: imageData, error: imageError } = await supabase
    .from("MCP_Image_Generation_and_Manipulation")
    .select("*");

  const { data: weatherData, error: weatherError } = await supabase
    .from("MCP_Weather_and_Location_Data")
    .select("*");

  const { data: webSearchData, error: webSearchError } = await supabase
    .from("MCP_web_search")
    .select("*");

  // 创建一个包含所有表格数据的数组
  const allSections: SectionData[] = [
    {
      id: "featured",
      title: "Featured",
      data: featuredList || [],
      count: featuredList?.length || 0,
    },
    {
      id: "ai-note",
      title: "AI Note Management",
      data: aiNoteData || [],
      count: aiNoteData?.length || 0,
    },
    {
      id: "application",
      title: "Application Integration Tools",
      data: applicationData || [],
      count: applicationData?.length || 0,
    },
    {
      id: "browser",
      title: "Browser Automation",
      data: browserData || [],
      count: browserData?.length || 0,
    },
    {
      id: "data-app",
      title: "Data and App Ecosystems",
      data: dataAppData || [],
      count: dataAppData?.length || 0,
    },
    {
      id: "git-workflow",
      title: "Git Workflow Management",
      data: gitWorkflowData || [],
      count: gitWorkflowData?.length || 0,
    },
    {
      id: "image",
      title: "Image Generation and Manipulation",
      data: imageData || [],
      count: imageData?.length || 0,
    },
    {
      id: "weather",
      title: "Weather and Location Data",
      data: weatherData || [],
      count: weatherData?.length || 0,
    },
    {
      id: "web-search",
      title: "Web Search",
      data: webSearchData || [],
      count: webSearchData?.length || 0,
    },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {allSections.map((section) => (
          <div key={section.id} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{section.title}</h2>
                {section.count > 0 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {section.count}
                  </span>
                )}
                <Link
                  href={`/toolbox/${section.id}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.data.map((tool) => (
                <Link
                  key={tool.id}
                  href={
                    tool.server
                      ? `https://www.npmjs.com/search?q=${tool.server.replace(
                          "@",
                          ""
                        )}`
                      : `https://www.npmjs.com/search?q=${encodeURIComponent(
                          tool.title
                        )}`
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
                            "@" +
                              (tool.title?.toLowerCase().replace(/\s+/g, "-") ||
                                "")}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
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
        ))}
      </div>
    </section>
  );
}
