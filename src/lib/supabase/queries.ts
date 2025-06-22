import { createClient } from "./client";
import { Database, CategoryWithTools, ToolWithDetails } from "./types";

// Use the centralized client creation function
const supabase = createClient();

/**
 * Get list of all categories
 */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a specific category by handle with associated tools
 */
export async function getCategoryByHandle(
  handle: string
): Promise<CategoryWithTools | null> {
  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("handle", handle)
    .single();

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError);
    return null;
  }

  // Then get tools in this category
  const { data: toolRelations, error: relationsError } = await supabase
    .from("tool_categories")
    .select("tool_id")
    .eq("category_handle", handle);

  if (relationsError) {
    console.error("Error fetching tool relations:", relationsError);
    return { ...category, tools: [] };
  }

  if (!toolRelations.length) {
    return { ...category, tools: [] };
  }

  // Get the actual tools
  const toolIds = toolRelations.map((relation) => relation.tool_id);
  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("*")
    .in("id", toolIds)
    .order("month_visited_count", { ascending: false });

  if (toolsError) {
    console.error("Error fetching tools:", toolsError);
    return { ...category, tools: [] };
  }

  return {
    ...category,
    tools: tools || [],
  };
}

/**
 * Get tool details with associated data
 */
export async function getToolWithDetails(
  id: number
): Promise<ToolWithDetails | null> {
  // Get the basic tool info
  const { data: tool, error: toolError } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .single();

  if (toolError || !tool) {
    console.error("Error fetching tool:", toolError);
    return null;
  }

  // Get categories for this tool
  const { data: categoryRelations, error: categoryError } = await supabase
    .from("tool_categories")
    .select("category_handle")
    .eq("tool_id", id);

  let categories = [];
  if (!categoryError && categoryRelations.length) {
    const handles = categoryRelations.map((rel) => rel.category_handle);
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .in("handle", handles);

    categories = cats || [];
  }

  // Get tags for this tool
  const { data: tagRelations, error: tagError } = await supabase
    .from("tool_tags")
    .select("tag_name")
    .eq("tool_id", id);

  let tags = [];
  if (!tagError && tagRelations.length) {
    const names = tagRelations.map((rel) => rel.tag_name);
    const { data: foundTags } = await supabase
      .from("tags")
      .select("*")
      .in("name", names);

    tags = foundTags || [];
  }

  // Get traffic info
  const { data: traffic, error: trafficError } = await supabase
    .from("tool_traffic")
    .select("*")
    .eq("tool_id", id)
    .maybeSingle();

  // Get attributes with options
  const { data: attributeRelations, error: attrError } = await supabase
    .from("tool_attributes")
    .select("*")
    .eq("tool_id", id);

  let attributes = [];
  if (!attrError && attributeRelations.length) {
    // Get unique attribute handles
    const attrHandles = [
      ...new Set(attributeRelations.map((rel) => rel.attribute_handle)),
    ];

    // Fetch attribute details
    const { data: attrs } = await supabase
      .from("attributes")
      .select("*")
      .in("handle", attrHandles);

    if (attrs) {
      // For each attribute, get its options used by this tool
      attributes = await Promise.all(
        attrs.map(async (attr) => {
          const relevantRelations = attributeRelations.filter(
            (rel) => rel.attribute_handle === attr.handle
          );

          const optionHandles = relevantRelations.map(
            (rel) => rel.option_handle
          );

          const { data: options } = await supabase
            .from("attribute_options")
            .select("*")
            .eq("attribute_handle", attr.handle)
            .in("handle", optionHandles);

          return {
            ...attr,
            options: options || [],
          };
        })
      );
    }
  }

  return {
    ...tool,
    categories,
    tags,
    traffic: traffic || undefined,
    attributes: attributes.length ? attributes : undefined,
  };
}

/**
 * Find tools by search term
 */
export async function searchTools(term: string) {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .or(
      `name.ilike.%${term}%,description.ilike.%${term}%,what_is_summary.ilike.%${term}%`
    )
    .order("month_visited_count", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error searching tools:", error);
    return [];
  }

  return data || [];
}

/**
 * Get all tools for a specific tag
 */
export async function getToolsByTag(tagName: string) {
  const { data: relations, error: relError } = await supabase
    .from("tool_tags")
    .select("tool_id")
    .eq("tag_name", tagName);

  if (relError || !relations.length) {
    return [];
  }

  const toolIds = relations.map((rel) => rel.tool_id);
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .in("id", toolIds)
    .order("month_visited_count", { ascending: false });

  if (error) {
    console.error("Error fetching tools by tag:", error);
    return [];
  }

  return data || [];
}
