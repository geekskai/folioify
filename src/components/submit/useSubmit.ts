// 更新为不使用CategoryType，改用type数字
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
 * 通用提交函数
 * @param data 提交数据
 * @returns 提交结果
 */
export async function submitResource(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
  type: number;
}): Promise<SubmissionResult> {
  try {
    console.log(
      `Submitting resource type ${data.type}...`,
      JSON.stringify(data, null, 2)
    );

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Submission failed:`, result);
      throw new Error(result.error || "Submission failed");
    }

    console.log(`Submission successful:`, result);
    return { success: true, id: result.id };
  } catch (error) {
    console.error(`Submission error:`, error);

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
 * 提交AI工具 (type=0)
 * @param data AI工具数据
 * @returns 提交结果
 */
export async function submitAITool(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
}): Promise<string> {
  const result = await submitResource({
    ...data,
    type: 0, // AI工具
  });

  if (!result.success) {
    throw new Error(result.error);
  }
  return result.id as string;
}

/**
 * 提交MCP服务器 (type=1)
 * @param data MCP服务器数据
 * @returns 提交结果
 */
export async function submitMCPServer(data: {
  title: string;
  logo_url: string;
  description: string;
  url: string;
  email?: string;
}): Promise<string> {
  const result = await submitResource({
    ...data,
    type: 1, // MCP服务器
  });

  if (!result.success) {
    throw new Error(result.error);
  }
  return result.id as string;
}
