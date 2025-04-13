import { fetchAndStoreCategoryData } from "../src/lib/toolify-fetcher";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function updateCategories() {
  console.log("Starting category data update...");

  try {
    const result = await fetchAndStoreCategoryData();

    if (result.success) {
      console.log("✅ Categories updated successfully!");
    } else {
      console.error("❌ Failed to update categories:", result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "❌ Error during update:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

// Run the function
updateCategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Uncaught error:", err);
    process.exit(1);
  });
