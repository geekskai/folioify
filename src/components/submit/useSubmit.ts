import { CategoryType } from "./SubmitContext";

interface SubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
}

// 定义一个可能有message属性的对象类型
interface ErrorWithMessage {
  message: string | unknown;
}

/**
 * 通用提交函数，接受类别类型和对应数据
 * @param data 提交数据
 * @param categoryType 类别类型
 * @returns 提交结果
 */
export async function submitResource(
  data: {
    title: string;
    logo_url: string;
    description: string;
    url: string;
    email?: string;
    tool_type?: string;
    server_type?: string;
  },
  categoryType: CategoryType
): Promise<SubmissionResult> {
  try {
    console.log(`Submitting ${categoryType}...`, JSON.stringify(data, null, 2));

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        category_type: categoryType,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`${categoryType} submission failed:`, result);
      throw new Error(result.error || "Submission failed");
    }

    console.log(`${categoryType} submission successful:`, result);
    return { success: true, id: result.id };
  } catch (error) {
    console.error(`${categoryType} submission error:`, error);

    // 确保返回有用的错误消息
    let errorMessage = "An unknown error occurred during submission";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String((error as ErrorWithMessage).message);
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * 提交AI工具
 * @param data AI工具数据
 * @returns 提交结果
 */
export async function submitAITool(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
  tool_type?: string;
}): Promise<string> {
  const result = await submitResource(data, "ai_tools");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.id as string;
}

/**
 * 提交MCP服务器
 * @param data MCP服务器数据
 * @returns 提交结果
 */
export async function submitMCPServer(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
  server_type?: string;
}): Promise<string> {
  const result = await submitResource(data, "mcp_servers");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.id as string;
}
