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
  // 使用数字表示类型: 0=AI工具, 1=MCP服务器, 2=其他
  type: z.number().int().min(0).max(2).default(0),
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
  type: z.literal(0).default(0),
});

// MCP服务器简化验证
export const mcpServersSchema = submissionSchema.extend({
  type: z.literal(1).default(1),
});
