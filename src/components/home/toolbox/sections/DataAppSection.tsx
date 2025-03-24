import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function DataAppSection() {
  // 获取数据和应用生态系统数据
  const dataAppData = await fetchSectionData("MCP_Data_and_App_Ecosystems");

  const sectionData: SectionData = {
    id: "data-app",
    title: "Data and App Ecosystems",
    data: dataAppData,
    count: dataAppData.length,
  };

  return <SectionContainer section={sectionData} />;
}
