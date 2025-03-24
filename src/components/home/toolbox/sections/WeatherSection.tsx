import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function WeatherSection() {
  // 获取天气和位置数据
  const weatherData = await fetchSectionData("MCP_Weather_and_Location_Data");

  const sectionData: SectionData = {
    id: "weather",
    title: "Weather and Location Data",
    data: weatherData,
    count: weatherData.length,
  };

  return <SectionContainer section={sectionData} />;
}
