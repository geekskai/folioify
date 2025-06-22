import { Database } from "./database-types";

// Re-export the main Database type
export type { Database } from "./database-types";

// Base types from Database
type Tables = Database["public"]["Tables"];

// Extended types for specific use cases
export interface CategoryWithTools {
  id: number;
  name: string;
  handle: string;
  description?: string;
  tools: Tool[];
}

export interface ToolWithDetails {
  id: number;
  name: string;
  description?: string;
  handle: string;
  website?: string;
  website_logo?: string;
  website_name?: string;
  what_is_summary?: string;
  month_visited_count?: number;
  category_handle?: string;
  created_at?: string;
  updated_at?: string;
  categories?: Category[];
  tags?: Tag[];
  traffic?: ToolTraffic;
  attributes?: AttributeWithOptions[];
}

export interface Tool {
  id: number;
  name: string;
  description?: string;
  handle: string;
  website?: string;
  website_logo?: string;
  website_name?: string;
  what_is_summary?: string;
  month_visited_count?: number;
  category_handle?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  handle: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  handle: string;
}

export interface ToolTraffic {
  id: number;
  tool_id: number;
  visits: number;
  created_at: string;
  updated_at: string;
}

export interface AttributeWithOptions {
  id: number;
  name: string;
  handle: string;
  options: AttributeOption[];
}

export interface AttributeOption {
  id: number;
  name: string;
  handle: string;
  attribute_handle: string;
}
