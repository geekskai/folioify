// import fetch from "node-fetch";
import dotenv from "dotenv";
import { createServerClient } from "../src/lib/supabase";

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

  // const categories = ["ai-paraphraser"];

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
