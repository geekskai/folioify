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
  !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("Missing Supabase environment variables");
  console.error("Required variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Use the shared Supabase client
const supabase = createServerClient();

/**
 * Save tool data to Supabase (single tool)
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
        `🔍 Debug - Inserting tool data:`,
        JSON.stringify(toolData, null, 2)
      );
    }

    const { error, status } = await supabase
      .from("category_item_detail")
      .upsert(toolData, { onConflict: "id" });

    if (error) {
      console.error(
        `❌ Error saving tool ${tool.id} to Supabase:`,
        error,
        `Status: ${status}`
      );
      return false;
    } else if (status >= 400) {
      // Sometimes error is empty but status indicates failure
      console.error(
        `❌ Error status ${status} saving tool ${tool.id}, but no error object`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error in saveToolToSupabase for tool ${tool.id}:`, error);
    return false;
  }
}

/**
 * Save multiple tools to Supabase in batch (批量保存)
 */
async function saveToolsBatchToSupabase(
  tools: ToolData[],
  categoryHandle: string,
  batchSize = 100,
  maxRetries = 3
) {
  try {
    // 将工具数据转换为数据库格式
    const toolsData = tools.map((tool) => ({
      id: tool.id,
      handle: tool.handle,
      image: tool.image,
      website: tool.website,
      website_logo: tool.website_logo,
      website_name: tool.website_name,
      what_is_summary: tool.what_is_summary,
      month_visited_count: tool.month_visited_count,
      category_handle: categoryHandle,
    }));

    let successCount = 0;
    let failureCount = 0;
    const failedBatches: typeof toolsData = [];

    // 分批处理，避免单次请求过大
    for (let i = 0; i < toolsData.length; i += batchSize) {
      const batch = toolsData.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;

      console.log(
        `🔥 Batch saving ${batch.length} tools (${i + 1}-${Math.min(
          i + batchSize,
          toolsData.length
        )}) for category: ${categoryHandle}`
      );

      let retryCount = 0;
      let batchSuccess = false;

      // 重试机制
      while (retryCount <= maxRetries && !batchSuccess) {
        try {
          const { error, status } = await supabase
            .from("category_item_detail")
            .upsert(batch, { onConflict: "id" });

          if (error) {
            throw new Error(
              `Supabase error: ${error.message}, Status: ${status}`
            );
          } else if (status >= 400) {
            throw new Error(`HTTP error status: ${status}`);
          } else {
            successCount += batch.length;
            batchSuccess = true;
            console.log(
              `✅ Successfully saved batch ${batchNumber} (${batch.length} tools)`
            );
          }
        } catch (batchError) {
          retryCount++;
          if (retryCount <= maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000); // 指数退避，最大10秒
            console.warn(
              `⚠️ Batch ${batchNumber} failed (attempt ${retryCount}/${
                maxRetries + 1
              }), retrying in ${delay}ms...`,
              batchError instanceof Error ? batchError.message : batchError
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error(
              `❌ Batch ${batchNumber} failed after ${
                maxRetries + 1
              } attempts:`,
              batchError instanceof Error ? batchError.message : batchError
            );
            failureCount += batch.length;
            failedBatches.push(...batch);
          }
        }
      }
    }

    // 如果有失败的批次，尝试单个保存
    if (failedBatches.length > 0) {
      console.log(
        `🔄 Attempting individual saves for ${failedBatches.length} failed items...`
      );

      for (const toolData of failedBatches) {
        try {
          const { error, status } = await supabase
            .from("category_item_detail")
            .upsert(toolData, { onConflict: "id" });

          if (error) {
            console.error(
              `❌ Individual save failed for tool ${toolData.id}:`,
              error?.message || `Status: ${status}`
            );
          }
        } catch (individualError) {
          console.error(
            `❌ Individual save catch error for tool ${toolData.id}:`,
            individualError
          );
        }
      }
    }

    console.log(
      `🚀 Batch operation completed: ${successCount} success, ${failureCount} failures`
    );
    return { successCount, failureCount, totalProcessed: tools.length };
  } catch (error) {
    console.error(`❌ Critical error in saveToolsBatchToSupabase:`, error);
    return {
      successCount: 0,
      failureCount: tools.length,
      totalProcessed: tools.length,
    };
  }
}

/**
 * Fetch data from Toolify API with pagination and save to Supabase
 */
async function fetchAndSaveToolifyData(handle: string, perPage = 1000) {
  let currentPage = 1;
  let hasMoreData = true;
  let totalTools = 0;

  console.log(`🔍 Fetching data for category: ${handle}`);

  // Store category information
  let categoryInfo = { handle, name: handle, tool_count: 0 };

  while (hasMoreData) {
    console.log(`🔍 Fetching page ${currentPage} for category: ${handle}`);

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
        console.error(
          `❌ Invalid response for category ${handle}:`,
          responseData
        );
        break;
      }

      const pageTools = responseData.data.data;
      console.log(`🌟 Found ${pageTools.length} tools on page ${currentPage}`);

      // If we got no tools, we've reached the end
      if (pageTools.length === 0) {
        hasMoreData = false;
        console.log(`🔚 No more data available for category: ${handle}`);
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

        // Save tools in batch (批量保存)
        console.log(
          `🔥 Batch saving ${pageTools.length} tools for category: ${handle}`
        );
        const batchResult = await saveToolsBatchToSupabase(pageTools, handle);
        const savedCount = batchResult.successCount;

        console.log(
          `🚀 Successfully saved ${savedCount} of ${pageTools.length} tools for category ${handle}`
        );

        totalTools += savedCount;

        // Move to the next page
        currentPage++;

        // If we got fewer tools than requested, we've reached the end
        if (pageTools.length < perPage) {
          hasMoreData = false;
          console.log(`🔚 Reached last page for category: ${handle}`);
        }
      }
    } catch (error) {
      console.error(
        `❌ Error fetching data for category ${handle}, page ${currentPage}:`,
        error
      );
      hasMoreData = false;
    }
  }

  console.log(
    `🚀 Processed a total of ${totalTools} tools for category: ${handle}`
  );
  return { totalTools, categoryInfo };
}

/**
 * Main function to fetch and store data for all categories
 */
async function syncAllCategories() {
  console.log("💡 Starting sync process...");

  // Fetch category handles from the database instead of using hardcoded list
  console.log("👀 Fetching category handles from database...");
  const { data: categoryValues, error } = await supabase
    .from("category_values")
    .select("handle")
    .order("tool_count", { ascending: false });

  if (error) {
    console.error("❌ Failed to fetch category handles from database:", error);
    return;
  }

  if (!categoryValues || categoryValues.length === 0) {
    console.warn(
      "⚠️ No category handles found in database. Using fallback method."
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
  console.log(`🔍 Found ${categories.length} categories in database to sync.`);
  console.log(`🔍 Categories:`, categories);

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
    console.log(`💥Processing category: ${category}`);
    const result = await fetchAndSaveToolifyData(category);
    totalProcessedTools += result.totalTools;
  }

  console.log(
    `✅ Sync completed. Total tools processed: ${totalProcessedTools}`
  );
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

const categories = [
  "ai-gif-generator",
  "ai-interview-assistant",
  "ai-developer-tools",
  "transcription",
  // "ai-workflow-management",
  "ai-scheduling",
  // "code&it-tool-4",
  "ai-knowledge-base",
  "ai-knowledge-graph",
  "sports",
  "ai-illustration-generator",
  "ai-speech-synthesis",
  "ai-email-marketing",
  // "productivity-tool-3",
  "ai-task-management",
  "ai-investing",
  "ai-waifu-generator",
  "ai-age-progression",
  "ai-audio-enhancer",
  "nsfw",
  "google-ads-ai",
  "ai-reply",
  "ai-github",
  "dirty-talking-ai",
  "ai-api",
  "ai-roleplay",
  "ai-language-learning",
  "ai-customer-service",
  "ai-translate",
  // "prompt-tool-1",
  "ai-describe-image",
  // "text-to-speech",
  "web3",
  "ai-spreadsheet",
  "ai-cover-generator",
  // "large-language-models-(llms)",
  "bio-link",
  "ai-domain-name-generator",
  "ai-voice-cloning",
  "ai-rewriter",
  // "design&art-tool-1",
  "ai-video-enhancer",
  "ai-emoji-generator",
  "ai-melody-generator",
  "ai-voice-over",
  // "ai-ad-creative-assistant",
  "ai-cosplay-generator",
  "ai-wallpaper-generator",
  // "summarizer",
  // "ai-trading-bot-assistant",
  // "game",
  "ai-music-video-generator",
  "ai-script-writing",
  // "life-assistant-tool-6",
  // "advertising-assistant",
  "ai-tutorial",
  "ai-rap-generator",
  // "ai-detector-tool-2",
  "ai-resume-builder",
  "ai-knowledge-management",
  "ai-sop",
  // "ai-photo-&-image-generator",
  // "voice-tool-6",
  // "prompt-tool-6",
  // "chatbot-tool-5",
  "ai-image-segmentation",
  "ai-recruiting",
  "ai-document-extraction",
  // "ai-podcast-assistant",
  "ai-book-writing",
  // "other-tool-2",
  // "life-assistant-2",
  // "ai-personalized-video-generator",
  // "ai-education-assistant",
  // "photo-image-editor",
  "ai-background-generator",
  "ai-email-generator",
  "ai-email-assistant",
  // "ai-anime-cartoon-generator",
  "ai-photo-enhancer",
  "ai-app-builder",
  "ai-mind-mapping",
  // "tax-assistant",
  "ai-bio-generator",
  // "digital-marketing-generator",
  // "3d-tool-2",
  "ai-celebrity-voice-generator",
  // "ai-photo-image-generator",
  "no-code-low-code",
  // "speech-to-text",
  // "ai-developer-docs",
  // "sales-assistant",
  "text-to-3d",
  // "ai-detector-tool-6",
  // "ai-maps-generator",
  "ai-code-assistant",
  "ai-avatar-generator",
  // "healthcare",
  // "essay-writer",
  // "text-to-music",
  // "ai-code-refactoring",
  "ai-tools-directory",
  // "mental-health",
  "ai-photo-restoration",
  "image-to-video",
  "ai-dating-assistant",
  "ai-noise-cancellation",
  // "design&art-tool-2",
  "ai-image-recognition",
  "ai-project-management",
  "ai-voice-changer",
  // "ai-log-management",
  "ai-video-editor",
  "nfts",
  // "ai-browsers-builder",
  // "ai-twitter-assistant",
  "ai-singing-generator",
  // "3d-tool-5",
  "ai-image-enhancer",
  // "ai-seo-assistant",
  // "ai-facebook-assistant",
  // "ai-instagram-assistant",
  // "voice-audio-editing",
  // "ai-content-generator",
  // "accounting-assistant",
  // "pick-up-lines-generator",
  "ai-thumbnail-maker",
  // "ai-manga-comic",
  // "prompt-1",
  "ai-video-generator",
  // "ai-consulting-assistant",
  // "ai-api-design",
  "ai-logo-generator",
  "ai-quizzes",
  "ai-presentation-generator",
  "ai-speech-recognition",
  // "copywriting",
  // "ai-team-collaboration",
  // "ai-analytics-assistant",
  "ai-tattoo-generator",
  "ai-business-ideas-generator",
  // "3d-tool-4",
  // "ai-reviews-assistant",
  "ai-quotes-generator",
  // "ai-hashtag-assistant",
  "ai-profile-picture-generator",
  // "ai-testing-qa",
  "ai-icon-generator",
  // "ai-blog-writer",
  "ai-website-builder",
  // "investing-assistant",
  // "papers",
  // "letter-writer",
  "ai-girlfriend",
  "ai-checker-essay",
  "ai-lyrics-generator",
  // "prompt-tool-5",
  // "ai-devops-assistant",
  // "ai-crm-assistant",
  // "ai-short-clips-generator",
  // "legal-assistant",
  "ai-homework-helper",
  "image-to-3d-model",
  // "ai-notes-assistant",
  "ai-video-recording",
  // "ai-anime-ai-art",
  // "3d-model-generator",
  "ai-diagram-generator",
  // "ai-recipe-assistant",
  // "design-assistant",
  // "ai-trip-planner",
  "ai-pixel-art",
  "ai-colorize",
  "other",
  // "religion",
  "ai-contract-management",
  "ai-coaching",
  "ai-course",
  // "ai-documents-assistant",
  // "newsletter",
  "ai-productivity-tools",
  "ai-cover-letter-generator",
  "translate",
  // "ai-code-explanation",
  "ai-plagiarism-checker",
  // "chatbot-tool-1",
  // "business-tool-3",
  // "business-tool-1",
  // "productivity-tool-1",
  "ai-creative-writing",
  // "business-tool-5",
  // "design&art-tool-5",
  "ai-code-generator",
  "ai-voice-assistants",
  // "ai-monitor-report-builder",
  // "ai-voice-chat-generator",
  // "ai-files-assistant",
  // "education-tool-5",
  // "fun-tools",
  // "code&it-tool-1",
  // "marketing-tool-4",
  // "marketing-tool-3",
  // "education-tool-3",
  // "education-tool-6",
  // "prompt-tool-3",
  "ai-charting",
  "text-to-video",
  // "ai-detector-tool-3",
  // "video-tool-1",
  // "business-tool-2",
  // "ai-sql-query-builder",
  "ai-god",
];

// syncCategoriesList(categories)
//   .then(() => {
//     console.log("✅ Sync completed successfully!");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("❌ Error during sync:", error);
//     process.exit(1);
//   });
