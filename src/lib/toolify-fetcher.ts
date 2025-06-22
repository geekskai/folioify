import { createServerClient } from "@/db/supabase/client";

// Define the response types based on the API structure
interface ToolifyResponse {
  code: number;
  message: string;
  data: {
    groups: CategoryGroup[];
    category_count: number;
    is_logged_in: boolean;
  };
  error_code: number;
}

interface CategoryGroup {
  title: string;
  name: string;
  handle: string;
  values: CategoryValue[];
}

interface CategoryValue {
  id: number;
  type: number;
  handle: string;
  name: string;
  tool_count: number;
  group_id: number;
  top_tool_count: number;
  top_visited_count: number;
}

export async function fetchAndStoreCategoryData() {
  // Initialize Supabase client with service role key for admin operations
  const supabase = createServerClient();

  try {
    // Fetch data from Toolify API
    const response = await fetch(
      "https://www.toolify.ai/self-api/v1/categories/groups?order_by=order&direction=desc"
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ToolifyResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`API error: ${data.message}`);
    }

    // Begin transaction
    // Store each category group and its values
    for (const group of data.data.groups) {
      // Insert or update the category group
      const { data: groupData, error: groupError } = await supabase
        .from("category_groups")
        .upsert(
          {
            title: group.title,
            name: group.name,
            handle: group.handle,
            updated_at: new Date(),
          },
          { onConflict: "handle" }
        )
        .select();

      if (groupError) {
        console.error("Error inserting category group:", groupError);
        continue;
      }

      // Get the group ID for foreign key reference
      const groupId = groupData?.[0]?.id;

      if (!groupId) {
        console.error("Failed to get group ID for:", group.handle);
        continue;
      }

      // Insert or update each category value
      for (const value of group.values) {
        const { error: valueError } = await supabase
          .from("category_values")
          .upsert(
            {
              id: value.id,
              type: value.type,
              handle: value.handle,
              name: value.name,
              tool_count: value.tool_count,
              group_id: groupId, // Use the id from our database
              top_tool_count: value.top_tool_count,
              top_visited_count: value.top_visited_count,
              updated_at: new Date(),
            },
            { onConflict: "id" }
          );

        if (valueError) {
          console.error("Error inserting category value:", valueError);
        }
      }
    }

    console.log("Successfully stored category data in Supabase");
    return { success: true, message: "Data successfully stored" };
  } catch (error) {
    console.error("Error fetching or storing category data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

fetchAndStoreCategoryData()
  .then(() => {
    console.log("✅ fetchAndStoreCategoryData sync completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error during sync:", error);
    process.exit(1);
  });
