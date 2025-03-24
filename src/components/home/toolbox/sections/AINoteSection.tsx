import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function AINoteSection() {
  // 获取AI笔记管理数据
  const aiNoteData = await fetchSectionData("MCP_AI_Note_Management");

  const sectionData: SectionData = {
    id: "ai-note",
    title: "AI Note Management",
    data: aiNoteData,
    count: aiNoteData.length,
  };

  return <SectionContainer section={sectionData} />;
}
