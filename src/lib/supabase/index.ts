// Re-export client functions
export {  createServerClient } from "./client";

// Re-export types
export type {
  Database,
  CategoryWithTools,
  ToolWithDetails,
  Tool,
  Category,
  Tag,
  ToolTraffic,
  AttributeWithOptions,
  AttributeOption,
} from "./types";

// Re-export database types
export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from "./database-types";

// Re-export query functions
export {
  getAllCategories,
  getCategoryByHandle,
  getToolWithDetails,
  searchTools,
  getToolsByTag,
} from "./queries";
