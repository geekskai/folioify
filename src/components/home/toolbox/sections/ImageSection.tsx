import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function ImageSection() {
  // 获取图像生成和处理数据
  const imageData = await fetchSectionData(
    "MCP_Image_Generation_and_Manipulation"
  );

  const sectionData: SectionData = {
    id: "image",
    title: "Image Generation and Manipulation",
    data: imageData,
    count: imageData.length,
  };

  return <SectionContainer section={sectionData} />;
}
