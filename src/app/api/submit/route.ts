import { NextResponse } from "next/server";
import { createServerClient } from "@/db/supabase/client";
import { z } from "zod";

// 简化验证模式
const submissionSchema = z.object({
  title: z.string().min(2).max(100),
  logo_url: z.string().url({ message: "Logo URL must be a valid URL" }),
  description: z.string().min(10).max(150),
  url: z.string().url(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  type: z.number().int().min(0).max(2).default(0), // 0=AI工具, 1=MCP服务器, 2=其他
});

// 错误响应函数
function errorResponse(message: string, details: unknown = null, status = 500) {
  console.error(message, details);
  return NextResponse.json(
    {
      error: message,
      details: details || "No additional details available",
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    console.log("Received submission data:", JSON.stringify(body));

    // 验证数据
    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.format());
      return errorResponse(
        "Invalid submission data",
        result.error.format(),
        400
      );
    }

    const data = result.data;

    try {
      // 初始化Supabase客户端
      const supabase = createServerClient();

      // 测试连接
      const { error: testError } = await supabase
        .from("submissions")
        .select("id")
        .limit(1);

      if (testError) {
        return errorResponse("Database connection failed", testError.message);
      }

      // 提交到表
      const { data: submissionData, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          title: data.title,
          logo_url: data.logo_url,
          description: data.description,
          url: data.url,
          email: data.email || null,
          type: data.type,
          status: "pending",
        })
        .select("id")
        .single();

      if (submissionError) {
        return errorResponse(
          `Failed to create submission: ${submissionError.message}`
        );
      }

      return NextResponse.json({ success: true, id: submissionData.id });
    } catch (dbError) {
      return errorResponse(
        "Database operation failed",
        (dbError as Error).message
      );
    }
  } catch (error) {
    return errorResponse("Internal server error", (error as Error).message);
  }
}
