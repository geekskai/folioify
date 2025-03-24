import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function ApplicationSection() {
  // 获取应用集成工具数据
  const applicationData = await fetchSectionData(
    "MCP_Application_Integration_Tools"
  );

  const sectionData: SectionData = {
    id: "application",
    title: "Application Integration Tools",
    data: applicationData,
    count: applicationData.length,
  };

  return <SectionContainer section={sectionData} />;
}
