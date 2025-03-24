import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function BrowserSection() {
  // 获取浏览器自动化数据
  const browserData = await fetchSectionData("MCP_Browser_Automation");

  const sectionData: SectionData = {
    id: "browser",
    title: "Browser Automation",
    data: browserData,
    count: browserData.length,
  };

  return <SectionContainer section={sectionData} />;
}
