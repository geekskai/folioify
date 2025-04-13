import fetch from "node-fetch";
import dotenv from "dotenv";
import { createServerClient } from "../src/db/supabase/client";

// Load environment variables
dotenv.config();

// Define API response types
interface ApiResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: ToolData[];
    is_logged_in: boolean;
  };
  error_code: number;
}

interface ToolData {
  id: number;
  handle: string;
  name: string;
  website: string;
  image: string;
  website_logo: string;
  description: string;
  what_is_summary: string;
  website_name: string;
  month_visited_count: number;
  collected_count: number;
  affiliate_link: string | null;
  created_at: string;
  is_noticeable: number;
  is_ad: boolean;
  advertisement_id: number | null;
  is_recommend_now: boolean;
  tags: string[];
  categories: {
    handle: string;
    name: string;
    tool_count: number;
  }[];
}

// Check if environment variables are set
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

// Use the shared Supabase client
const supabase = createServerClient();

/**
 * Create necessary database tables if they don't exist
 */
async function setupDatabase() {
  try {
    console.log("Setting up database tables...");

    // Print current Supabase URL for debugging
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    // List available tables first
    const { data: tablesList, error: tablesError } = await supabase.rpc(
      "get_tables"
    );

    if (tablesError) {
      console.error("Error fetching tables list:", tablesError);
    } else {
      console.log("Available tables in the database:", tablesList);
    }

    // Check if category_item_detail table exists
    const { error: categoryItemDetailError } = await supabase
      .from("category_item_detail")
      .select("*", { count: "exact", head: true })
      .limit(0);

    if (categoryItemDetailError && categoryItemDetailError.code === "42P01") {
      // Table doesn't exist, create it
      console.log("Creating category_item_detail table...");
      const { error: createError } = await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE category_item_detail (
            id BIGINT PRIMARY KEY,
            handle TEXT NOT NULL,
            image TEXT,
            website TEXT,
            website_logo TEXT,
            website_name TEXT,
            what_is_summary TEXT,
            month_visited_count BIGINT,
            category_handle TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX idx_category_item_detail_handle ON category_item_detail(handle);
          CREATE INDEX idx_category_item_detail_category_handle ON category_item_detail(category_handle);
          
          -- Create a function to update the updated_at column
          CREATE OR REPLACE FUNCTION update_category_item_detail_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
          
          -- Create trigger to update updated_at column
          CREATE TRIGGER set_category_item_detail_updated_at
          BEFORE UPDATE ON category_item_detail
          FOR EACH ROW
          EXECUTE FUNCTION update_category_item_detail_updated_at();
        `,
      });

      if (createError) {
        console.error(
          "Error creating category_item_detail table:",
          createError
        );
        return false;
      }
      console.log("Table category_item_detail created successfully.");
    } else if (categoryItemDetailError) {
      console.error(
        "Error checking category_item_detail table:",
        categoryItemDetailError
      );
      return false;
    } else {
      console.log("Table category_item_detail already exists.");
    }

    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}

/**
 * Save tool data to Supabase
 */
async function saveToolToSupabase(tool: ToolData, categoryHandle: string) {
  try {
    // Extract only the fields we want to store
    const toolData = {
      id: tool.id,
      handle: tool.handle,
      image: tool.image,
      website: tool.website,
      website_logo: tool.website_logo,
      website_name: tool.website_name,
      what_is_summary: tool.what_is_summary,
      month_visited_count: tool.month_visited_count,
      category_handle: categoryHandle,
    };

    // Log detailed information for the first few tools to debug
    if (tool.id < 100) {
      console.log(
        `Debug - Inserting tool data:`,
        JSON.stringify(toolData, null, 2)
      );
    }

    const { error, status } = await supabase
      .from("category_item_detail")
      .upsert(toolData, { onConflict: "id" });

    if (error) {
      console.error(
        `Error saving tool ${tool.id} to Supabase:`,
        error,
        `Status: ${status}`
      );
      return false;
    } else if (status >= 400) {
      // Sometimes error is empty but status indicates failure
      console.error(
        `Error status ${status} saving tool ${tool.id}, but no error object`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in saveToolToSupabase for tool ${tool.id}:`, error);
    return false;
  }
}

/**
 * Fetch data from Toolify API with pagination and save to Supabase
 */
async function fetchAndSaveToolifyData(handle: string, perPage = 100) {
  let currentPage = 1;
  let hasMoreData = true;
  let totalTools = 0;

  console.log(`Fetching data for category: ${handle}`);

  // Store category information
  let categoryInfo = { handle, name: handle, tool_count: 0 };

  while (hasMoreData) {
    console.log(`Fetching page ${currentPage} for category: ${handle}`);

    try {
      // Construct the API URL
      const apiUrl = `https://www.toolify.ai/self-api/v1/categories/detail-v1?handle=${handle}&order_by=category_correlation&page=${currentPage}&per_page=${perPage}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = (await response.json()) as ApiResponse;

      if (
        responseData.code !== 200 ||
        !responseData.data ||
        !responseData.data.data
      ) {
        console.error(`Invalid response for category ${handle}:`, responseData);
        break;
      }

      const pageTools = responseData.data.data;
      console.log(`Found ${pageTools.length} tools on page ${currentPage}`);

      // If we got no tools, we've reached the end
      if (pageTools.length === 0) {
        hasMoreData = false;
        console.log(`No more data available for category: ${handle}`);
      } else {
        // Get category info from the first tool if available
        if (pageTools.length > 0 && pageTools[0].categories) {
          const categoryFromTool = pageTools[0].categories.find(
            (cat) => cat.handle === handle
          );
          if (categoryFromTool) {
            categoryInfo = categoryFromTool;
          }
        }

        // Save each tool
        let savedCount = 0;
        for (const tool of pageTools) {
          const success = await saveToolToSupabase(tool, handle);
          if (success) savedCount++;
        }

        console.log(
          `Successfully saved ${savedCount} of ${pageTools.length} tools for category ${handle}`
        );

        totalTools += savedCount;

        // Move to the next page
        currentPage++;

        // If we got fewer tools than requested, we've reached the end
        if (pageTools.length < perPage) {
          hasMoreData = false;
          console.log(`Reached last page for category: ${handle}`);
        }
      }
    } catch (error) {
      console.error(
        `Error fetching data for category ${handle}, page ${currentPage}:`,
        error
      );
      hasMoreData = false;
    }
  }

  console.log(
    `Processed a total of ${totalTools} tools for category: ${handle}`
  );
  return { totalTools, categoryInfo };
}

/**
 * Main function to fetch and store data for all categories
 */
async function syncAllCategories() {
  console.log("Starting sync process...");

  // Fetch category handles from the database instead of using hardcoded list
  console.log("Fetching category handles from database...");
  const { data: categoryValues, error } = await supabase
    .from("category_values")
    .select("handle")
    .order("tool_count", { ascending: false });

  if (error) {
    console.error("Failed to fetch category handles from database:", error);
    return;
  }

  if (!categoryValues || categoryValues.length === 0) {
    console.warn(
      "No category handles found in database. Using fallback method."
    );
    // Fallback to a few key categories if no data in database
    const fallbackCategories = [
      "ai-blog-writer",
      "ai-chatbot",
      "ai-code-assistant",
      "text-writing",
      "ai-image-generator",
    ];
    await syncCategoriesList(fallbackCategories);
    return;
  }

  // Extract handles from the result
  const categories = categoryValues.map((item) => item.handle);
  console.log(`Found ${categories.length} categories in database to sync.`);

  await syncCategoriesList(categories);
}

/**
 * Process a list of category handles
 */
async function syncCategoriesList(categories: string[]) {
  let totalProcessedTools = 0;

  // Process each category
  for (const category of categories) {
    console.log(`Processing category: ${category}`);
    const result = await fetchAndSaveToolifyData(category);
    totalProcessedTools += result.totalTools;
  }

  console.log(`Sync completed. Total tools processed: ${totalProcessedTools}`);
}

// Run the sync process
syncAllCategories()
  .then(() => {
    console.log("✅ Toolify sync completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error during sync:", error);
    process.exit(1);
  });
