import { SectionContainer } from "../SectionContainer";
import { SectionData } from "../SectionList";
import { fetchSectionData } from "../utils/fetchSectionData";

export async function GitWorkflowSection() {
  // 获取Git工作流管理数据
  const gitWorkflowData = await fetchSectionData("MCP_Git_Workflow_Management");

  const sectionData: SectionData = {
    id: "git-workflow",
    title: "Git Workflow Management",
    data: gitWorkflowData,
    count: gitWorkflowData.length,
  };

  return <SectionContainer section={sectionData} />;
}
