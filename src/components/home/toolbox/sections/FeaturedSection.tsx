import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function FeaturedSection() {
  // 获取特色列表数据
  const featuredList = await fetchSectionData("MCP_Featured_List");

  const sectionData: SectionData = {
    id: "featured",
    title: "Featured",
    data: featuredList,
    count: featuredList.length,
  };

  return <SectionContainer section={sectionData} />;
}
