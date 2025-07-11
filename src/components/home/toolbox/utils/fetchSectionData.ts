import { createServerClient } from "@/lib/supabase";
import { ToolItem } from "../SectionList";

export async function fetchSectionData(tableName: string): Promise<ToolItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from(
      tableName as
        | "MCP_Featured_List"
        | "MCP_AI_Note_Management"
        | "MCP_Application_Integration_Tools"
        | "MCP_Browser_Automation"
        | "MCP_Data_and_App_Ecosystems"
        | "MCP_Git_Workflow_Management"
        | "MCP_Image_Generation_and_Manipulation"
        | "MCP_Weather_and_Location_Data"
        | "MCP_web_search"
        | "submit"
    )
    .select("*");

  if (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return [];
  }

  return (data as ToolItem[]) || [];
}
