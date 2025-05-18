import { NextResponse } from "next/server";
import { createServerClient } from "@/db/supabase/client";
import { z } from "zod";

// Validation schema for API requests - updated to match client validation
const submissionSchema = z.object({
  title: z.string().min(2).max(100),
  // 放宽logo_url验证，只要是有效URL即可
  logo_url: z.string().url({ message: "Logo URL must be a valid URL" }),
  description: z.string().min(10).max(150),
  url: z.string().url(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  category_type: z.enum(["ai_tools", "mcp_servers"]),
  // Category-specific fields
  tool_type: z.string().optional().or(z.literal("")),
  server_type: z.string().optional().or(z.literal("")),
});

// Define valid tool types based on database constraints
const VALID_TOOL_TYPES = [
  "saas",
  "api",
  "open_source",
  "browser_extension",
  "other",
];

// 添加类型定义
type SubmissionData = z.infer<typeof submissionSchema>;

// 类别特定处理的配置
const CATEGORY_HANDLERS: Record<
  string,
  {
    table: string;
    defaultType: string;
    validTypes?: string[];
    getFields: (data: SubmissionData) => Record<string, string>;
    errorMessage: string;
  }
> = {
  ai_tools: {
    table: "ai_tools_submissions",
    defaultType: "saas",
    validTypes: VALID_TOOL_TYPES,
    getFields: (data: SubmissionData) => ({
      tool_type: VALID_TOOL_TYPES.includes(data.tool_type || "")
        ? data.tool_type || "saas"
        : "saas",
    }),
    errorMessage: "Failed to create AI tool details",
  },
  mcp_servers: {
    table: "mcp_servers_submissions",
    defaultType: "other",
    getFields: (data: SubmissionData) => ({
      server_type: data.server_type || "other",
    }),
    errorMessage: "Failed to create MCP server details",
  },
};

// 通用错误响应函数
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
    // Parse request body
    const body = await request.json();

    console.log("Received submission data:", JSON.stringify(body));

    // Validate data
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

    // 确保特定字段有默认值
    if (data.category_type === "ai_tools" && !data.tool_type) {
      data.tool_type = "saas";
    }

    if (data.category_type === "mcp_servers" && !data.server_type) {
      data.server_type = "other";
    }

    console.log("Validated data with defaults:", JSON.stringify(data));

    try {
      // Initialize Supabase server client with service role key
      const supabase = createServerClient();

      // Test connection
      const { error: testError } = await supabase
        .from("submissions")
        .select("id")
        .limit(1);

      if (testError) {
        return errorResponse("Database connection failed", testError.message);
      }

      console.log("Supabase connection successful, proceeding with insertion");

      // Insert into submissions table with service role (bypasses RLS)
      const { data: submissionData, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          title: data.title,
          logo_url: data.logo_url,
          description: data.description,
          url: data.url,
          email: data.email || null,
          category_type: data.category_type,
          status: "pending",
        })
        .select("id")
        .single();

      if (submissionError) {
        return errorResponse(
          `Failed to create submission: ${submissionError.message}`
        );
      }

      const submissionId = submissionData.id;
      console.log("Created submission with ID:", submissionId);

      // 使用配置处理特定类别
      const categoryHandler = CATEGORY_HANDLERS[data.category_type];
      if (categoryHandler) {
        const categoryFields = categoryHandler.getFields(data);
        console.log(`Using fields for ${data.category_type}:`, categoryFields);

        const { error: detailError } = await supabase
          .from(categoryHandler.table)
          .insert({
            id: submissionId,
            ...categoryFields,
          });

        if (detailError) {
          // Try to clean up the main submission
          await supabase.from("submissions").delete().eq("id", submissionId);
          return errorResponse(
            `${categoryHandler.errorMessage}: ${detailError.message}`,
            detailError.details
          );
        }
      }

      return NextResponse.json({ success: true, id: submissionId });
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
