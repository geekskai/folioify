import * as z from "zod";

// 简化的通用字段验证
export const submissionSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." }),
  logo_url: z
    .string()
    .min(1, { message: "Logo URL is required." })
    .refine(
      (url) => {
        // Simple validation - just require it starts with http
        return url.startsWith("http");
      },
      {
        message:
          "Please provide a valid image URL starting with http:// or https://",
      }
    ),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(150, { message: "Description should be less than 150 characters." }),
  url: z.string().url({ message: "Please enter a valid resource URL." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional()
    .or(z.literal("")),
});

// 与数据库约束一致的工具类型
const VALID_TOOL_TYPES = [
  "saas",
  "api",
  "open_source",
  "browser_extension",
  "other",
] as const;

// AI工具简化验证
export const aiToolsSchema = submissionSchema.extend({
  tool_type: z
    .enum(VALID_TOOL_TYPES, {
      required_error: "Please select a tool type.",
      invalid_type_error: "Invalid tool type selected.",
    })
    .default("saas"),
});

// MCP服务器简化验证
export const mcpServersSchema = submissionSchema.extend({
  server_type: z.string().default("other"),
});
