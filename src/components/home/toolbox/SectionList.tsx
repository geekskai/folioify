import { createClient } from "@/db/supabase/client";
import { SectionContainer } from "./SectionContainer";

// 定义工具项的通用类型
export type ToolItem = {
  id: number;
  icon?: string;
  title: string;
  count?: string | number;
  server?: string;
  descript?: string;
};

// 定义部分显示的类型
export type SectionData = {
  id: string;
  title: string;
  data: ToolItem[];
  count: number;
};

export async function SectionList() {
  const supabase = createClient();

  // 获取所有表格数据
  const { data: featuredList } = await supabase
    .from("MCP_Featured_List")
    .select("*");

  const { data: aiNoteData } = await supabase
    .from("MCP_AI_Note_Management")
    .select("*");

  const { data: applicationData } = await supabase
    .from("MCP_Application_Integration_Tools")
    .select("*");

  const { data: browserData } = await supabase
    .from("MCP_Browser_Automation")
    .select("*");

  const { data: dataAppData } = await supabase
    .from("MCP_Data_and_App_Ecosystems")
    .select("*");

  const { data: gitWorkflowData } = await supabase
    .from("MCP_Git_Workflow_Management")
    .select("*");

  const { data: imageData } = await supabase
    .from("MCP_Image_Generation_and_Manipulation")
    .select("*");

  const { data: weatherData } = await supabase
    .from("MCP_Weather_and_Location_Data")
    .select("*");

  const { data: webSearchData } = await supabase
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
    <>
      {allSections.map((section) => (
        <SectionContainer key={section.id} section={section} />
      ))}
    </>
  );
}
