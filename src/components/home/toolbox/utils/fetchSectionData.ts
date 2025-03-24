import { createClient } from "@/db/supabase/client";
import { ToolItem } from "../SectionList";

export async function fetchSectionData(tableName: string): Promise<ToolItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return [];
  }

  return (data as ToolItem[]) || [];
}
