import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function WebSearchSection() {
  // 获取网络搜索数据
  const webSearchData = await fetchSectionData("MCP_web_search");

  const sectionData: SectionData = {
    id: "web-search",
    title: "Web Search",
    data: webSearchData,
    count: webSearchData.length,
  };

  return <SectionContainer section={sectionData} />;
}
