import * as z from "zod";

// 简化的通用字段验证
export const submissionSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." }),
  logo_url: z
    .string()
    .url({ message: "Please enter a valid Logo URL." })
    .refine(
      (url) => {
        if (!url) return false;
        return url.match(/\.(jpeg|jpg|gif|png|svg|webp|ico)(\?.*)?$/i) !== null;
      },
      {
        message:
          "Please provide a valid image URL (.jpg, .png, .svg, .gif, .webp, .ico)",
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

// AI工具简化验证
export const aiToolsSchema = submissionSchema.extend({
  tool_type: z
    .enum(["saas", "api", "open_source", "browser_extension", "other"], {
      required_error: "Please select a tool type.",
    })
    .optional(),
});

// MCP服务器简化验证
export const mcpServersSchema = submissionSchema.extend({
  server_type: z.string().optional().or(z.literal("")),
});
