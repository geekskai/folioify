import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";

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
  traffic: {
    top_region: string;
    top_region_value: number;
    growth: number;
    growth_rate: number;
    monthly_visits_mail: number;
    monthly_visits_direct: number;
    monthly_visits_search: number;
    monthly_visits_social: number;
    monthly_visits_referrals: number;
    monthly_visits_paid_referrals: number;
    top_traffic_sources: {
      title: string;
      value: number;
    }[];
  };
  attributes: {
    handle: string;
    name: string;
    options: {
      name: string;
      handle: string;
    }[];
  }[];
}

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categories to fetch (you can expand this list)
const categories = [
  "ai-blog-writer",
  "ai-chatbot",
  "ai-code-assistant",
  "ai-content-generator",
  "ai-email-assistant",
  "ai-image-generator",
  "ai-video-generator",
  "text-writing",
  "copywriting",
  "paraphraser",
  "writing-assistants",
  "ai-content-generator",
  "ai-email-writer",
  "ai-pdf",
  "ai-documents-assistant",
  "ai-document-extraction",
  "ai-mind-mapping",
  "ai-notes-assistant",
  "ai-productivity-tools",
  "ai-knowledge-management",
  "ai-knowledge-base",
  "translate",
  "research-tool",
  "mental-health",
  "healthcare",
  "fitness",
  "sales-assistant",
  "digital-marketing-generator",
  "ai-analytics-assistant",
  "ai-business-ideas-generator",
  "ai-consulting-assistant",
  "ai-domain-name-generator",
  "advertising-assistant",
  "ai-customer-service-assistant",
  "ai-project-management",
  "ai-task-management",
  "ai-team-collaboration",
  "ai-trading-bot-assistant",
  "ai-instagram-assistant",
  "newsletter",
  "ai-accounting-assistant",
  // Add more categories as needed
];

// Main function to fetch and store category data
async function importCategoryData() {
  for (const category of categories) {
    console.log(`Fetching data for category: ${category}`);

    try {
      // Fetch data from the API
      const response = await fetch(
        `https://www.toolify.ai/self-api/v1/categories/detail-v1?handle=${category}&order_by=category_correlation&page=1&per_page=100`
      );

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
          `Invalid response for category ${category}:`,
          responseData
        );
        continue;
      }

      const categoryTools = responseData.data.data;
      console.log(
        `Found ${categoryTools.length} tools for category ${category}`
      );

      // Process and store each tool
      for (const tool of categoryTools) {
        // 1. Insert/update in the tools table
        const { error: toolError } = await supabase.from("tools").upsert(
          {
            id: tool.id,
            handle: tool.handle,
            name: tool.name,
            website: tool.website,
            image: tool.image,
            website_logo: tool.website_logo,
            description: tool.description,
            what_is_summary: tool.what_is_summary,
            website_name: tool.website_name,
            month_visited_count: tool.month_visited_count,
            collected_count: tool.collected_count,
            affiliate_link: tool.affiliate_link,
            created_at: tool.created_at,
            is_noticeable: tool.is_noticeable,
            is_ad: tool.is_ad || false,
            advertisement_id: tool.advertisement_id,
            is_recommend_now: tool.is_recommend_now,
          },
          { onConflict: "id" }
        );

        if (toolError) {
          console.error(`Error inserting tool ${tool.id}:`, toolError);
          continue;
        }

        // 2. Insert/update tags
        if (tool.tags && tool.tags.length > 0) {
          for (const tag of tool.tags) {
            // First ensure the tag exists
            const { error: tagError } = await supabase
              .from("tags")
              .upsert({ name: tag }, { onConflict: "name" });

            if (tagError) {
              console.error(`Error inserting tag ${tag}:`, tagError);
              continue;
            }

            // Then link it to the tool
            const { error: toolTagError } = await supabase
              .from("tool_tags")
              .upsert(
                {
                  tool_id: tool.id,
                  tag_name: tag,
                },
                { onConflict: "tool_id,tag_name" }
              );

            if (toolTagError) {
              console.error(
                `Error linking tag ${tag} to tool ${tool.id}:`,
                toolTagError
              );
            }
          }
        }

        // 3. Insert/update tool categories
        if (tool.categories && tool.categories.length > 0) {
          for (const cat of tool.categories) {
            // First ensure the category exists
            const { error: catError } = await supabase
              .from("categories")
              .upsert(
                {
                  handle: cat.handle,
                  name: cat.name,
                  tool_count: cat.tool_count,
                },
                { onConflict: "handle" }
              );

            if (catError) {
              console.error(
                `Error inserting category ${cat.handle}:`,
                catError
              );
              continue;
            }

            // Then link it to the tool
            const { error: toolCatError } = await supabase
              .from("tool_categories")
              .upsert(
                {
                  tool_id: tool.id,
                  category_handle: cat.handle,
                },
                { onConflict: "tool_id,category_handle" }
              );

            if (toolCatError) {
              console.error(
                `Error linking category ${cat.handle} to tool ${tool.id}:`,
                toolCatError
              );
            }
          }
        }

        // 4. Insert/update traffic data
        if (tool.traffic) {
          const { error: trafficError } = await supabase
            .from("tool_traffic")
            .upsert(
              {
                tool_id: tool.id,
                top_region: tool.traffic.top_region,
                top_region_value: tool.traffic.top_region_value,
                growth: tool.traffic.growth,
                growth_rate: tool.traffic.growth_rate,
                monthly_visits_mail: tool.traffic.monthly_visits_mail,
                monthly_visits_direct: tool.traffic.monthly_visits_direct,
                monthly_visits_search: tool.traffic.monthly_visits_search,
                monthly_visits_social: tool.traffic.monthly_visits_social,
                monthly_visits_referrals: tool.traffic.monthly_visits_referrals,
                monthly_visits_paid_referrals:
                  tool.traffic.monthly_visits_paid_referrals,
                traffic_sources: tool.traffic.top_traffic_sources,
              },
              { onConflict: "tool_id" }
            );

          if (trafficError) {
            console.error(
              `Error inserting traffic data for tool ${tool.id}:`,
              trafficError
            );
          }
        }

        // 5. Insert/update attributes
        if (tool.attributes && tool.attributes.length > 0) {
          for (const attr of tool.attributes) {
            // First ensure the attribute exists
            const { error: attrError } = await supabase
              .from("attributes")
              .upsert(
                {
                  handle: attr.handle,
                  name: attr.name,
                },
                { onConflict: "handle" }
              );

            if (attrError) {
              console.error(
                `Error inserting attribute ${attr.handle}:`,
                attrError
              );
              continue;
            }

            // Then process each option
            if (attr.options && attr.options.length > 0) {
              for (const option of attr.options) {
                // Ensure the option exists
                const { error: optionError } = await supabase
                  .from("attribute_options")
                  .upsert(
                    {
                      handle: option.handle,
                      name: option.name,
                      attribute_handle: attr.handle,
                    },
                    { onConflict: "handle,attribute_handle" }
                  );

                if (optionError) {
                  console.error(
                    `Error inserting option ${option.handle}:`,
                    optionError
                  );
                  continue;
                }

                // Link to the tool
                const { error: toolAttrError } = await supabase
                  .from("tool_attributes")
                  .upsert(
                    {
                      tool_id: tool.id,
                      attribute_handle: attr.handle,
                      option_handle: option.handle,
                    },
                    { onConflict: "tool_id,attribute_handle,option_handle" }
                  );

                if (toolAttrError) {
                  console.error(
                    `Error linking attribute ${attr.handle} to tool ${tool.id}:`,
                    toolAttrError
                  );
                }
              }
            }
          }
        }
      }

      console.log(`Successfully processed category: ${category}`);
    } catch (error) {
      console.error(`Error processing category ${category}:`, error);
    }
  }
}

// Run the import
importCategoryData()
  .then(() => console.log("Import completed"))
  .catch((error) => console.error("Import failed:", error));
