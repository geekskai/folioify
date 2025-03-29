export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "text-writing", name: "Text&Writing" },
  { id: "image", name: "Image" },
  { id: "video", name: "Video" },
  { id: "code-it", name: "Code&IT" },
  { id: "voice", name: "Voice" },
  { id: "business", name: "Business" },
  { id: "marketing", name: "Marketing" },
  { id: "ai-detector", name: "AI Detector" },
  { id: "chatbot", name: "Chatbot" },
  { id: "design-art", name: "Design&Art" },
  { id: "life-assistant", name: "Life Assistant" },
  { id: "3d", name: "3D" },
  { id: "education", name: "Education" },
  { id: "prompt", name: "Prompt" },
  { id: "productivity", name: "Productivity" },
  { id: "other", name: "Other" },
];

// 辅助函数，根据分类ID获取分类名称
export function getCategoryName(id: string): string {
  const category = categories.find((cat) => cat.id === id);
  return category ? category.name : id;
}
