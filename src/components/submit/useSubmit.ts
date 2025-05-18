import { CategoryType } from "./SubmitContext";

// Submit AI tool with simplified fields
export async function submitAITool(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
  tool_type?: string;
}) {
  try {
    console.log("Submitting AI tool...");

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        category_type: "ai_tools",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI tool submission failed:", errorData);
      throw new Error(errorData.error || "Submission failed");
    }

    const result = await response.json();
    console.log("AI tool submission successful", result);
    return result.id;
  } catch (error) {
    console.error("AI tool submission error:", error);
    throw error;
  }
}

// Submit MCP server with simplified fields
export async function submitMCPServer(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
  server_type?: string;
}) {
  try {
    console.log("Submitting MCP server...");

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        category_type: "mcp_servers",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("MCP server submission failed:", errorData);
      throw new Error(errorData.error || "Submission failed");
    }

    const result = await response.json();
    console.log("MCP server submission successful", result);
    return result.id;
  } catch (error) {
    console.error("MCP server submission error:", error);
    throw error;
  }
}
