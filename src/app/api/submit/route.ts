import { NextResponse } from "next/server";
import { createServerClient } from "@/db/supabase/client";
import { z } from "zod";

// Validation schema for API requests - updated to match client validation
const submissionSchema = z.object({
  title: z.string().min(2).max(100),
  logo_url: z.string().url(),
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

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    console.log("Received submission data:", JSON.stringify(body));

    // Validate data
    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.format());
      return NextResponse.json(
        { error: "Invalid submission data", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    console.log("Validated data:", JSON.stringify(data));

    try {
      // Initialize Supabase server client with service role key
      const supabase = createServerClient();

      // Test connection
      const { data: testData, error: testError } = await supabase
        .from("submissions")
        .select("id")
        .limit(1);
      if (testError) {
        console.error("Supabase connection test failed:", testError);
        return NextResponse.json(
          { error: "Database connection failed", details: testError.message },
          { status: 500 }
        );
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
        console.error("Submission creation failed:", submissionError);
        return NextResponse.json(
          { error: `Failed to create submission: ${submissionError.message}` },
          { status: 500 }
        );
      }

      const submissionId = submissionData.id;
      console.log("Created submission with ID:", submissionId);

      // Insert into category-specific table based on type
      if (data.category_type === "ai_tools") {
        // Ensure valid tool_type for AI tools
        let toolType = data.tool_type || "saas"; // Default to saas
        if (!VALID_TOOL_TYPES.includes(toolType)) {
          toolType = "saas"; // Fallback to a safe default if value is not in allowed list
        }

        console.log(`Using tool_type: ${toolType} for AI tool submission`);

        const { error: toolError } = await supabase
          .from("ai_tools_submissions")
          .insert({
            id: submissionId,
            tool_type: toolType,
          });

        if (toolError) {
          console.error("AI tool details insertion failed:", toolError);
          // Try to clean up the main submission
          await supabase.from("submissions").delete().eq("id", submissionId);
          return NextResponse.json(
            {
              error: `Failed to create AI tool details: ${toolError.message}`,
              details: toolError.details || "No additional details available",
            },
            { status: 500 }
          );
        }
      } else if (data.category_type === "mcp_servers") {
        const { error: serverError } = await supabase
          .from("mcp_servers_submissions")
          .insert({
            id: submissionId,
            server_type: data.server_type || "other",
          });

        if (serverError) {
          console.error("MCP server details insertion failed:", serverError);
          // Try to clean up the main submission
          await supabase.from("submissions").delete().eq("id", submissionId);
          return NextResponse.json(
            {
              error: `Failed to create MCP server details: ${serverError.message}`,
              details: serverError.details || "No additional details available",
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ success: true, id: submissionId });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return NextResponse.json(
        {
          error: "Database operation failed",
          details: (dbError as Error).message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Submission API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
