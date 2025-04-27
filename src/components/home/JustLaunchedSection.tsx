"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

// 定义工具数据接口
interface Category {
  handle: string;
  name: string;
  tool_count: number;
}

// interface Tool {
//   website: string;
//   collected_count: number;
//   description: string;
//   handle: string;
//   id: number;
//   image: string;
//   month_visited_count: number;
//   name: string;
//   user_collected: number;
//   what_is_summary: string;
//   traffic: {
//     top_region: string | null;
//     top_region_value: number | null;
//   };
//   categories: Category[];
//   is_recommend_now: number;
//   is_noticeable: number;
//   advertisement_id: number | null;
//   is_ad: boolean;
//   website_name: string;
//   extension: any;
// }
const todayListV1 = [
  {
    website: "https://ehva.ai?utm_source=toolify",
    collected_count: 0,
    description: "Conversational AI by Phone - Customer Service, Sales, More.",
    handle: "ehva-ai",
    id: 25796,
    image: "https://cdn-images.toolify.ai/174295220374098223.jpg",
    month_visited_count: 0,
    name: "EHVA.ai",
    user_collected: 0,
    what_is_summary:
      "Conversational AI by Phone - Customer Service, Sales, More.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "other",
        name: "Other",
        tool_count: 2958,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800274,
    is_ad: true,
    website_name: "EHVA.ai",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351229_95682864_25796.webp",
  },
  {
    website:
      "https://canny.io/features/autopilot?utm_source=toolify&utm_medium=cpc",
    collected_count: 5,
    description: "All-in-one customer feedback management platform.",
    handle: "canny-autopilot",
    id: 22469,
    image: "https://cdn-images.toolify.ai/173176389272109916.jpg",
    month_visited_count: 853004,
    name: "Canny Autopilot",
    user_collected: 0,
    what_is_summary: "All-in-one customer feedback management platform.",
    traffic: {
      top_region: "US",
      top_region_value: 0.22302737427889233,
    },
    categories: [
      {
        handle: "speech-to-text",
        name: "Speech-to-Text",
        tool_count: 520,
      },
      {
        handle: "research-tool",
        name: "Research Tool",
        tool_count: 453,
      },
      {
        handle: "translate",
        name: "Translate",
        tool_count: 602,
      },
      {
        handle: "summarizer",
        name: "Summarizer",
        tool_count: 1230,
      },
      {
        handle: "ai-roadmap-generator",
        name: "AI Roadmap Generator",
        tool_count: 75,
      },
      {
        handle: "ai-knowledge-base",
        name: "AI Knowledge Base",
        tool_count: 765,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1199,
      },
      {
        handle: "ai-task-management",
        name: "AI Task Management",
        tool_count: 585,
      },
      {
        handle: "ai-project-management",
        name: "AI Project Management",
        tool_count: 441,
      },
      {
        handle: "ai-customer-service-assistant",
        name: "AI Customer Service Assistant",
        tool_count: 1464,
      },
      {
        handle: "ai-reply-assistant",
        name: "AI Reply Assistant",
        tool_count: 1558,
      },
      {
        handle: "ai-team-collaboration",
        name: "AI Team Collaboration",
        tool_count: 423,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800248,
    is_ad: true,
    website_name: "Canny",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744350545_81550263_22469.webp",
  },
  {
    website:
      "https://miro.com/?red=toolifc2273c&utm_source=toolifc2273c&utm_medium=cpa&utm_affiliate_network=reditus",
    collected_count: 36,
    description:
      "Summary: Miro helps distributed teams collaborate and co-create efficiently across different locations.",
    handle: "miro",
    id: 1297,
    image: "https://cdn-images.toolify.ai/168248936914786180.jpg",
    month_visited_count: 30568149,
    name: "Miro",
    user_collected: 0,
    what_is_summary:
      "Summary: Miro helps distributed teams collaborate and co-create efficiently across different locations.",
    traffic: {
      top_region: "US",
      top_region_value: 0.15191505013872678,
    },
    categories: [
      {
        handle: "ai-team-collaboration",
        name: "AI Team Collaboration",
        tool_count: 423,
      },
      {
        handle: "ai-product-description-generator",
        name: "AI Product Description Generator",
        tool_count: 2193,
      },
      {
        handle: "ai-workflow-management",
        name: "AI Workflow Management",
        tool_count: 718,
      },
      {
        handle: "ai-project-management",
        name: "AI Project Management",
        tool_count: 441,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1199,
      },
      {
        handle: "ai-task-management",
        name: "AI Task Management",
        tool_count: 585,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800272,
    is_ad: true,
    website_name: "Miro",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250410/1744256650_83434197_1297.webp",
  },
  {
    website:
      "https://www.nume.finance/?utm_source=toolify&utm_medium=listing&utm_campaign=waitlist-launch",
    collected_count: 35,
    description: "The AI CFO every founder needs",
    handle: "nume",
    id: 22618,
    image: "https://cdn-images.toolify.ai/173225617745960163.jpg",
    month_visited_count: 30469,
    name: "Nume",
    user_collected: 0,
    what_is_summary: "The AI CFO every founder needs",
    traffic: {
      top_region: "VN",
      top_region_value: 0.32784577119601327,
    },
    categories: [
      {
        handle: "accounting-assistant",
        name: "AI Accounting Assistant",
        tool_count: 106,
      },
      {
        handle: "ai-consulting-assistant",
        name: "AI Consulting Assistant",
        tool_count: 115,
      },
      {
        handle: "ai-spreadsheet",
        name: "AI Spreadsheet",
        tool_count: 116,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1199,
      },
      {
        handle: "ai-business-ideas-generator",
        name: "AI Business Ideas Generator",
        tool_count: 137,
      },
      {
        handle: "tax-assistant",
        name: "Tax Assistant",
        tool_count: 42,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3432,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800223,
    is_ad: true,
    website_name: "Nume",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744350576_90235469_22618.webp",
  },
  {
    website: "https://lovestudy.ai?utm_source=toolifyai",
    collected_count: 4,
    description:
      "AI tools for creating flashcards, quizzes, and notes for better learning.",
    handle: "lovestudy",
    id: 26060,
    image: "https://cdn-images.toolify.ai/174365060735207834.jpg",
    month_visited_count: 516,
    name: "LoveStudy",
    user_collected: 0,
    what_is_summary:
      "AI tools for creating flashcards, quizzes, and notes for better learning.",
    traffic: {
      top_region: "SG",
      top_region_value: 1,
    },
    categories: [
      {
        handle: "ai-quizzes",
        name: "AI Quizzes",
        tool_count: 310,
      },
      {
        handle: "ai-education-assistant",
        name: "AI Education Assistant",
        tool_count: 794,
      },
      {
        handle: "ai-pdf",
        name: "AI PDF",
        tool_count: 338,
      },
      {
        handle: "ai-notes-assistant",
        name: "AI Notes Assistant",
        tool_count: 413,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800278,
    is_ad: true,
    website_name: "LoveStudy",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351275_58764281_26060.webp",
  },
  {
    website: "https://www.soulmachines.com?utm_source=toolify",
    collected_count: 8,
    description:
      "Founded in 2016, Soul Machines is a global pioneer in the humanization of AI. Our patented, ground-breaking Experiential AI™ technology powers emotionally intelligent AI Assistants that create personalized, interactive digital engagement in real time.",
    handle: "soul-machines",
    id: 24763,
    image: "https://cdn-images.toolify.ai/user-upload/1740199316_79145056",
    month_visited_count: 71374,
    name: "Soul Machines",
    user_collected: 0,
    what_is_summary:
      "Founded in 2016, Soul Machines is a global pioneer in the humanization of AI. Our patented, ground-breaking Experiential AI™ technology powers emotionally intelligent AI Assistants that create personalized, interactive digital engagement in real time.",
    traffic: {
      top_region: "VN",
      top_region_value: 0.21245659287658436,
    },
    categories: [
      {
        handle: "ai-avatar-generator",
        name: "AI Avatar Generator",
        tool_count: 424,
      },
      {
        handle: "ai-interview-assistant",
        name: "AI Interview Assistant",
        tool_count: 410,
      },
      {
        handle: "ai-coaching",
        name: "AI Coaching",
        tool_count: 322,
      },
      {
        handle: "ai-homework-helper",
        name: "Homework Helper",
        tool_count: 273,
      },
      {
        handle: "sports",
        name: "Sports",
        tool_count: 72,
      },
      {
        handle: "healthcare",
        name: "Healthcare",
        tool_count: 313,
      },
      {
        handle: "mental-health",
        name: "Mental Health",
        tool_count: 232,
      },
      {
        handle: "fitness",
        name: "Fitness",
        tool_count: 156,
      },
      {
        handle: "ai-recruiting",
        name: "AI Recruiting",
        tool_count: 700,
      },
      {
        handle: "life-assistant-2",
        name: "Life Assistant",
        tool_count: 229,
      },
      {
        handle: "ai-animated-video",
        name: "AI Animated Video",
        tool_count: 234,
      },
      {
        handle: "ai-trip-planner",
        name: "AI Trip Planner",
        tool_count: 174,
      },
      {
        handle: "ai-dating-assistant",
        name: "AI Dating Assistant",
        tool_count: 174,
      },
      {
        handle: "ai-character",
        name: "AI Character",
        tool_count: 464,
      },
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 620,
      },
      {
        handle: "ai-consulting-assistant",
        name: "AI Consulting Assistant",
        tool_count: 115,
      },
      {
        handle: "ai-video-generator",
        name: "AI Video Generator",
        tool_count: 521,
      },
      {
        handle: "ai-personalized-video-generator",
        name: "AI Personalized Video Generator",
        tool_count: 184,
      },
      {
        handle: "ai-education-assistant",
        name: "AI Education Assistant",
        tool_count: 794,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800252,
    is_ad: true,
    website_name: "Soul Machines",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351052_31767983_24763.webp",
  },
  {
    website: "https://www.heyalice.app?ref=toolify",
    collected_count: 1,
    description:
      "Your AI-powered personal assistant for increased productivity",
    handle: "alice",
    id: 12537,
    image: "https://cdn-images.toolify.ai/171307949418759721.webp",
    month_visited_count: 31954,
    name: "Alice",
    user_collected: 0,
    what_is_summary:
      "Your AI-powered personal assistant for increased productivity",
    traffic: {
      top_region: "PL",
      top_region_value: 0.1994788285539227,
    },
    categories: [
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3432,
      },
      {
        handle: "large-language-models-(llms)",
        name: "Large Language Models (LLMs)",
        tool_count: 2374,
      },
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2536,
      },
      {
        handle: "prompt-1",
        name: "Prompt",
        tool_count: 760,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 3054,
      },
      {
        handle: "ai-grammar-checker",
        name: "AI Grammar Checker",
        tool_count: 344,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4220,
      },
      {
        handle: "ai-voice-assistants",
        name: "AI Voice Assistants",
        tool_count: 379,
      },
      {
        handle: "ai-reply-assistant",
        name: "AI Reply Assistant",
        tool_count: 1558,
      },
      {
        handle: "ai-response-generator",
        name: "AI Response Generator",
        tool_count: 1577,
      },
      {
        handle: "translate",
        name: "Translate",
        tool_count: 602,
      },
      {
        handle: "ai-email-assistant",
        name: "AI Email Assistant",
        tool_count: 1050,
      },
      {
        handle: "copywriting",
        name: "Copywriting",
        tool_count: 951,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1199,
      },
      {
        handle: "ai-email-generator",
        name: "AI Email Generator",
        tool_count: 569,
      },
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1483,
      },
      {
        handle: "ai-rewriter",
        name: "AI Rewriter",
        tool_count: 693,
      },
      {
        handle: "general-writing",
        name: "General Writing",
        tool_count: 1010,
      },
      {
        handle: "ai-workflow-management",
        name: "AI Workflow Management",
        tool_count: 718,
      },
      {
        handle: "ai-scheduling",
        name: "AI Scheduling",
        tool_count: 350,
      },
      {
        handle: "ai-task-management",
        name: "AI Task Management",
        tool_count: 585,
      },
      {
        handle: "paraphraser",
        name: "Paraphraser",
        tool_count: 592,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800285,
    is_ad: true,
    website_name: "Alice App - Your private AI Assistant",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250410/1744258351_31241481_12537.webp",
  },
  {
    website: "https://www.wui.ai?utm_source=toolify",
    collected_count: 36,
    description: "AI tool for turning long videos into short clips.",
    handle: "wui-ai",
    id: 21441,
    image: "https://cdn-images.toolify.ai/172947803987210734.jpg",
    month_visited_count: 39447,
    name: "WUI.AI",
    user_collected: 0,
    what_is_summary: "AI tool for turning long videos into short clips.",
    traffic: {
      top_region: "VN",
      top_region_value: 0.31845774353631146,
    },
    categories: [
      {
        handle: "ai-repurpose-assistant",
        name: "AI Repurpose Assistant",
        tool_count: 355,
      },
      {
        handle: "ai-short-clips-generator",
        name: "AI Short Clips Generator",
        tool_count: 205,
      },
      {
        handle: "ai-podcast-assistant",
        name: "AI Podcast Assistant",
        tool_count: 267,
      },
      {
        handle: "ai-tiktok-assistant",
        name: "AI Tiktok Assistant",
        tool_count: 298,
      },
      {
        handle: "captions-or-subtitle",
        name: "Captions or Subtitle",
        tool_count: 509,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 3054,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4220,
      },
      {
        handle: "ai-ugc-video-generator",
        name: "AI UGC Video Generator",
        tool_count: 141,
      },
      {
        handle: "ai-video-editor",
        name: "AI Video Editor",
        tool_count: 348,
      },
      {
        handle: "ai-video-generator",
        name: "AI Video Generator",
        tool_count: 521,
      },
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1483,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800235,
    is_ad: true,
    website_name: "WUI.AI",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744363286_22609022_21441.webp",
  },
  {
    website: "https://www.salesape.ai/?red=toolif4e9d90&utm_source=toolify",
    collected_count: 1,
    description:
      "SalesAPE is your AI inbound sales rep - qualifying leads, booking meetings, and growing your revenue 24/7. Built for small businesses. No code, no software setup, no hassle.",
    handle: "salesape-ai",
    id: 26055,
    image: "https://cdn-images.toolify.ai/174359890711472451.jpg",
    month_visited_count: 64998,
    name: "SalesAPE AI",
    user_collected: 0,
    what_is_summary:
      "SalesAPE is your AI inbound sales rep - qualifying leads, booking meetings, and growing your revenue 24/7. Built for small businesses. No code, no software setup, no hassle.",
    traffic: {
      top_region: "US",
      top_region_value: 0.33154979661339773,
    },
    categories: [
      {
        handle: "ai-api-design",
        name: "AI API Design",
        tool_count: 202,
      },
      {
        handle: "sales-assistant",
        name: "Sales Assistant",
        tool_count: 727,
      },
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2536,
      },
      {
        handle: "ai-reply-assistant",
        name: "AI Reply Assistant",
        tool_count: 1558,
      },
      {
        handle: "ai-crm-assistant",
        name: "AI CRM Assistant",
        tool_count: 602,
      },
      {
        handle: "ai-email-assistant",
        name: "AI Email Assistant",
        tool_count: 1050,
      },
      {
        handle: "ai-email-generator",
        name: "AI Email Generator",
        tool_count: 569,
      },
      {
        handle: "ai-response-generator",
        name: "AI Response Generator",
        tool_count: 1577,
      },
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1335,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3432,
      },
      {
        handle: "ai-meeting-assistant",
        name: "AI Meeting Assistant",
        tool_count: 310,
      },
      {
        handle: "ai-workflow-management",
        name: "AI Workflow Management",
        tool_count: 718,
      },
      {
        handle: "ai-scheduling",
        name: "AI Scheduling",
        tool_count: 350,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800277,
    is_ad: true,
    website_name: "SalesAPE AI",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351274_32048510_26055.webp",
  },
  {
    website: "https://www.videoideas.ai?utm_source=toolify",
    collected_count: 7,
    description: "AI assistant for generating YouTube video scripts and ideas.",
    handle: "videoideasai",
    id: 26007,
    image: "https://cdn-images.toolify.ai/174338400155767830.jpg",
    month_visited_count: 377,
    name: "VideoIdeasAI",
    user_collected: 0,
    what_is_summary:
      "AI assistant for generating YouTube video scripts and ideas.",
    traffic: {
      top_region: "IN",
      top_region_value: 1,
    },
    categories: [
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 620,
      },
      {
        handle: "ai-script-writing",
        name: "AI Script Writing",
        tool_count: 263,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4220,
      },
      {
        handle: "ai-video-editor",
        name: "AI Video Editor",
        tool_count: 348,
      },
      {
        handle: "advertising-assistant",
        name: "AI Advertising Assistant",
        tool_count: 2400,
      },
      {
        handle: "ai-ad-creative-assistant",
        name: "AI Ad Creative Assistant",
        tool_count: 794,
      },
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2536,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800282,
    is_ad: true,
    website_name: "VideoIdeas.ai",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351265_60799993_26007.webp",
  },
  {
    website: "https://rubii.ai?utm_source=toolify",
    collected_count: 46,
    description:
      "Rubii: AI native fandom character UGC platform. Create your character, feed, and stage. Create interactive stories, chat with virtual partners, and explore user-generated content.",
    handle: "rubii",
    id: 21203,
    image: "https://cdn-images.toolify.ai/user-upload/1730877391_57699507",
    month_visited_count: 514952,
    name: "Rubii",
    user_collected: 0,
    what_is_summary:
      "Rubii: AI native fandom character UGC platform. Create your character, feed, and stage. Create interactive stories, chat with virtual partners, and explore user-generated content.",
    traffic: {
      top_region: "TW",
      top_region_value: 0.2735697137477826,
    },
    categories: [
      {
        handle: "ai-character",
        name: "AI Character",
        tool_count: 464,
      },
      {
        handle: "ai-novel",
        name: "Novel",
        tool_count: 105,
      },
      {
        handle: "ai-story-writing",
        name: "AI Story Writing",
        tool_count: 495,
      },
      {
        handle: "ai-creative-writing",
        name: "AI Creative Writing",
        tool_count: 618,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4220,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800205,
    is_ad: true,
    website_name: "Rubii AI",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250410/1744260397_93734324_21203.webp",
  },
  {
    website:
      "https://www.getreditus.com/referral/?red=reditus&sid=toolify&utm_source=toolify",
    collected_count: 2,
    description:
      "Create Word Of Mouth around your B2B SaaS via affiliates and your users.",
    handle: "reditus",
    id: 25786,
    image: "https://cdn-images.toolify.ai/174289101715051095.jpg",
    month_visited_count: 39648,
    name: "Reditus",
    user_collected: 0,
    what_is_summary:
      "Create Word Of Mouth around your B2B SaaS via affiliates and your users.",
    traffic: {
      top_region: "VN",
      top_region_value: 0.3171398221215215,
    },
    categories: [
      {
        handle: "sales-assistant",
        name: "Sales Assistant",
        tool_count: 727,
      },
      {
        handle: "digital-marketing-generator",
        name: "Digital Marketing Generator",
        tool_count: 278,
      },
      {
        handle: "ai-tools-directory",
        name: "AI Tools Directory",
        tool_count: 744,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800279,
    is_ad: true,
    website_name: "Reditus",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351228_57687931_25786.webp",
  },
  {
    website: "https://heycerebro.com?utm_source=toolify",
    collected_count: 0,
    description:
      "AI tool for organizing and extracting insights from digital content.",
    handle: "cerebro",
    id: 26528,
    image: "https://cdn-images.toolify.ai/174528487284600743.jpg",
    month_visited_count: 198,
    name: "Cerebro",
    user_collected: 0,
    what_is_summary:
      "AI tool for organizing and extracting insights from digital content.",
    traffic: {
      top_region: "PT",
      top_region_value: 1.0000000000000002,
    },
    categories: [
      {
        handle: "ai-podcast-assistant",
        name: "AI Podcast Assistant",
        tool_count: 267,
      },
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 620,
      },
      {
        handle: "ai-knowledge-management",
        name: "AI Knowledge Management",
        tool_count: 467,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1199,
      },
      {
        handle: "ai-notes-assistant",
        name: "AI Notes Assistant",
        tool_count: 413,
      },
      {
        handle: "research-tool",
        name: "Research Tool",
        tool_count: 453,
      },
      {
        handle: "summarizer",
        name: "Summarizer",
        tool_count: 1230,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4220,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 3054,
      },
      {
        handle: "papers",
        name: "Papers",
        tool_count: 276,
      },
      {
        handle: "report-writing",
        name: "Report Writing",
        tool_count: 316,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800287,
    is_ad: true,
    website_name: "Cerebro",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250422/1745285155_38585060_26528.webp",
  },
  {
    website:
      "https://freebeat.ai/?utm_source=toolifyai&utm_medium=referral&utm_campaign=toolifyai_20250314&utm_content=submittool",
    collected_count: 1,
    description: "Turn Music & Ideas into Viral Videos In One Click",
    handle: "freebeat",
    id: 17735,
    image: "https://cdn-images.toolify.ai/174237870359363481.png",
    month_visited_count: 29114,
    name: "freebeat",
    user_collected: 0,
    what_is_summary: "Turn Music & Ideas into Viral Videos In One Click",
    traffic: {
      top_region: "US",
      top_region_value: 0.34107345730893196,
    },
    categories: [
      {
        handle: "fitness",
        name: "Fitness",
        tool_count: 156,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800268,
    is_ad: true,
    website_name: "freebeat.ai",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250410/1744259100_92951433_17735.webp",
  },
  {
    website: "https://dailos.ai?utm_source=toolify",
    collected_count: 8,
    description: "Create personalized children's stories with AI for kids.",
    handle: "dailos-ai",
    id: 24405,
    image: "https://cdn-images.toolify.ai/173828691958658916.jpg",
    month_visited_count: 876,
    name: "Dailos AI",
    user_collected: 0,
    what_is_summary: "Create personalized children's stories with AI for kids.",
    traffic: {
      top_region: "PK",
      top_region_value: 1,
    },
    categories: [
      {
        handle: "ai-story-writing",
        name: "AI Story Writing",
        tool_count: 495,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800283,
    is_ad: true,
    website_name: "Dailos AI",
    extension: null,
    is_free: true,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744350942_68715362_24405.webp",
  },
  {
    website: "https://themisforcrypto.com?utm_source=toolify",
    collected_count: 3,
    description: "AI-driven tools for crypto trading and analysis.",
    handle: "themis-for-crypto",
    id: 21852,
    image: "https://cdn-images.toolify.ai/173025354333470899.jpg",
    month_visited_count: 6604,
    name: "Themis For Crypto",
    user_collected: 0,
    what_is_summary: "AI-driven tools for crypto trading and analysis.",
    traffic: {
      top_region: "AU",
      top_region_value: 1.0000000000000002,
    },
    categories: [
      {
        handle: "ai-trading-bot-assistant",
        name: "AI Trading Bot Assistant",
        tool_count: 159,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800276,
    is_ad: true,
    website_name: "Themis For Crypto",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744350452_59722384_21852.webp",
  },
  {
    website: "https://mgx.dev/?utm_source=toolify",
    collected_count: 1,
    description: "24/7 AI Teams: builds apps, games, PPTs, analyzes.",
    handle: "metagpt-mgx",
    id: 26210,
    image: "https://cdn-images.toolify.ai/user-upload/1744202492_34808585",
    month_visited_count: 343419,
    name: "MetaGPT (MGX)",
    user_collected: 0,
    what_is_summary: "24/7 AI Teams: builds apps, games, PPTs, analyzes.",
    traffic: {
      top_region: "CN",
      top_region_value: 0.31422969528409417,
    },
    categories: [
      {
        handle: "ai-landing-page-builder",
        name: "AI Landing Page Builder",
        tool_count: 267,
      },
      {
        handle: "ai-website-builder",
        name: "AI Website Builder",
        tool_count: 545,
      },
      {
        handle: "ai-code-generator",
        name: "AI Code Generator",
        tool_count: 418,
      },
      {
        handle: "ai-search-engine",
        name: "AI Search Engine",
        tool_count: 313,
      },
      {
        handle: "ai-app-builder",
        name: "AI App Builder",
        tool_count: 486,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3432,
      },
      {
        handle: "ai-presentation-generator",
        name: "AI Presentation Generator",
        tool_count: 213,
      },
      {
        handle: "ai-sop",
        name: "AI SOP",
        tool_count: 24,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800281,
    is_ad: true,
    website_name: "MetaGPT (MGX)",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744351310_94345062_26210.webp",
  },
  {
    website: "https://ai.vadoo.tv?utm_source=toolify",
    collected_count: 0,
    description: "AI dashboard for video creation and management.",
    handle: "vadoo-ai",
    id: 26562,
    image: "https://cdn-images.toolify.ai/174537126816166389.png",
    month_visited_count: 267246,
    name: "Vadoo AI",
    user_collected: 0,
    what_is_summary: "AI dashboard for video creation and management.",
    traffic: {
      top_region: "US",
      top_region_value: 0.2335967716974021,
    },
    categories: [
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 157,
      },
      {
        handle: "ai-story-writing",
        name: "AI Story Writing",
        tool_count: 495,
      },
      {
        handle: "ai-lip-sync-generator",
        name: "AI Lip Sync Generator",
        tool_count: 71,
      },
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 620,
      },
      {
        handle: "ai-tiktok-assistant",
        name: "AI Tiktok Assistant",
        tool_count: 298,
      },
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1443,
      },
      {
        handle: "3d-model-generator",
        name: "AI 3D Model Generator",
        tool_count: 128,
      },
      {
        handle: "image-to-3d-model",
        name: "Image to 3D Model",
        tool_count: 44,
      },
      {
        handle: "ai-video-recording",
        name: "AI Video Recording",
        tool_count: 302,
      },
      {
        handle: "captions-or-subtitle",
        name: "Captions or Subtitle",
        tool_count: 509,
      },
      {
        handle: "ai-script-writing",
        name: "AI Script Writing",
        tool_count: 263,
      },
      {
        handle: "ai-creative-writing",
        name: "AI Creative Writing",
        tool_count: 618,
      },
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1483,
      },
      {
        handle: "photo-image-editor",
        name: "Photo & Image Editor",
        tool_count: 842,
      },
      {
        handle: "ai-background-remover",
        name: "AI Background Remover",
        tool_count: 277,
      },
      {
        handle: "ai-face-swap-generator",
        name: "AI Face Swap Generator",
        tool_count: 132,
      },
      {
        handle: "ai-anime-cartoon-generator",
        name: "AI Anime & Cartoon Generator",
        tool_count: 162,
      },
      {
        handle: "ai-video-editor",
        name: "AI Video Editor",
        tool_count: 348,
      },
      {
        handle: "ai-thumbnail-maker",
        name: "AI Thumbnail Maker",
        tool_count: 64,
      },
      {
        handle: "ai-video-enhancer",
        name: "AI Video Enhancer",
        tool_count: 100,
      },
      {
        handle: "ai-image-enhancer",
        name: "AI Image Enhancer",
        tool_count: 488,
      },
      {
        handle: "ai-photo-enhancer",
        name: "AI Photo Enhancer",
        tool_count: 593,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800288,
    is_ad: true,
    website_name: "Vadoo AI",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250423/1745371358_75172250_26562.webp",
  },
  {
    website: "https://www.teammates.ai?utm_source=toolify",
    collected_count: 2,
    description:
      "Autonomous AI Teammates that take on entire business functions, end-to-end.",
    handle: "teammates-ai",
    id: 24407,
    image: "https://cdn-images.toolify.ai/173841341672226217.jpg",
    month_visited_count: 5306,
    name: "Teammates.ai",
    user_collected: 0,
    what_is_summary:
      "Autonomous AI Teammates that take on entire business functions, end-to-end.",
    traffic: {
      top_region: "VN",
      top_region_value: 0.5241673500105062,
    },
    categories: [
      {
        handle: "ai-blog-writer",
        name: "AI Blog Writer",
        tool_count: 552,
      },
      {
        handle: "legal-assistant",
        name: "Legal Assistant",
        tool_count: 167,
      },
      {
        handle: "ai-crm-assistant",
        name: "AI CRM Assistant",
        tool_count: 602,
      },
      {
        handle: "ai-reviews-assistant",
        name: "AI Reviews Assistant",
        tool_count: 353,
      },
      {
        handle: "ai-email-assistant",
        name: "AI Email Assistant",
        tool_count: 1050,
      },
      {
        handle: "ai-email-generator",
        name: "AI Email Generator",
        tool_count: 569,
      },
      {
        handle: "ai-email-marketing",
        name: "AI Email Marketing",
        tool_count: 839,
      },
      {
        handle: "ai-response-generator",
        name: "AI Response Generator",
        tool_count: 1577,
      },
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1335,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3432,
      },
      {
        handle: "ai-character",
        name: "AI Character",
        tool_count: 464,
      },
      {
        handle: "life-assistant-2",
        name: "Life Assistant",
        tool_count: 229,
      },
      {
        handle: "ai-interview-assistant",
        name: "AI Interview Assistant",
        tool_count: 410,
      },
      {
        handle: "ai-recruiting",
        name: "AI Recruiting",
        tool_count: 700,
      },
      {
        handle: "prompt-1",
        name: "Prompt",
        tool_count: 760,
      },
      {
        handle: "ai-seo-assistant",
        name: "AI SEO Assistant",
        tool_count: 996,
      },
      {
        handle: "ai-spreadsheet",
        name: "AI Spreadsheet",
        tool_count: 116,
      },
      {
        handle: "ai-task-management",
        name: "AI Task Management",
        tool_count: 585,
      },
      {
        handle: "ai-team-collaboration",
        name: "AI Team Collaboration",
        tool_count: 423,
      },
      {
        handle: "ai-meeting-assistant",
        name: "AI Meeting Assistant",
        tool_count: 310,
      },
      {
        handle: "ai-notes-assistant",
        name: "AI Notes Assistant",
        tool_count: 413,
      },
      {
        handle: "ai-workflow-management",
        name: "AI Workflow Management",
        tool_count: 718,
      },
      {
        handle: "ai-project-management",
        name: "AI Project Management",
        tool_count: 441,
      },
      {
        handle: "ai-mind-mapping",
        name: "AI Mind Mapping",
        tool_count: 79,
      },
      {
        handle: "ai-video-recording",
        name: "AI Video Recording",
        tool_count: 302,
      },
      {
        handle: "ai-diagram-generator",
        name: "AI Diagram Generator",
        tool_count: 57,
      },
      {
        handle: "ai-files-assistant",
        name: "AI Files Assistant",
        tool_count: 122,
      },
      {
        handle: "large-language-models-(llms)",
        name: "Large Language Models (LLMs)",
        tool_count: 2374,
      },
      {
        handle: "ai-repurpose-assistant",
        name: "AI Repurpose Assistant",
        tool_count: 355,
      },
      {
        handle: "ai-reply-assistant",
        name: "AI Reply Assistant",
        tool_count: 1558,
      },
      {
        handle: "copywriting",
        name: "Copywriting",
        tool_count: 951,
      },
      {
        handle: "ai-speech-synthesis",
        name: "AI Speech Synthesis",
        tool_count: 348,
      },
      {
        handle: "report-writing",
        name: "Report Writing",
        tool_count: 316,
      },
      {
        handle: "ai-rewriter",
        name: "AI Rewriter",
        tool_count: 693,
      },
      {
        handle: "ai-script-writing",
        name: "AI Script Writing",
        tool_count: 263,
      },
      {
        handle: "transcription",
        name: "Transcription",
        tool_count: 619,
      },
      {
        handle: "general-writing",
        name: "General Writing",
        tool_count: 1010,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 3054,
      },
      {
        handle: "ai-email-writer",
        name: "AI Email Writer",
        tool_count: 843,
      },
      {
        handle: "ai-product-description-generator",
        name: "AI Product Description Generator",
        tool_count: 2193,
      },
      {
        handle: "ai-audio-enhancer",
        name: "AI Audio Enhancer",
        tool_count: 120,
      },
      {
        handle: "speech-to-text",
        name: "Speech-to-Text",
        tool_count: 520,
      },
      {
        handle: "ai-voice-chat-generator",
        name: "AI Voice Chat Generator",
        tool_count: 56,
      },
      {
        handle: "ai-voice-cloning",
        name: "AI Voice Cloning",
        tool_count: 154,
      },
      {
        handle: "ai-voice-assistants",
        name: "AI Voice Assistants",
        tool_count: 379,
      },
      {
        handle: "ai-customer-service-assistant",
        name: "AI Customer Service Assistant",
        tool_count: 1464,
      },
      {
        handle: "accounting-assistant",
        name: "AI Accounting Assistant",
        tool_count: 106,
      },
      {
        handle: "research-tool",
        name: "Research Tool",
        tool_count: 453,
      },
      {
        handle: "ai-consulting-assistant",
        name: "AI Consulting Assistant",
        tool_count: 115,
      },
      {
        handle: "tax-assistant",
        name: "Tax Assistant",
        tool_count: 42,
      },
      {
        handle: "investing-assistant",
        name: "Investing Assistant",
        tool_count: 213,
      },
      {
        handle: "sales-assistant",
        name: "Sales Assistant",
        tool_count: 727,
      },
      {
        handle: "ai-domain-name-generator",
        name: "Domain Name Generator",
        tool_count: 82,
      },
      {
        handle: "e-commerce-assistant",
        name: "E-commerce Assistant",
        tool_count: 464,
      },
      {
        handle: "ai-instagram-assistant",
        name: "AI Instagram Assistant",
        tool_count: 440,
      },
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 620,
      },
      {
        handle: "ai-facebook-assistant",
        name: "AI Facebook Assistant",
        tool_count: 303,
      },
      {
        handle: "ai-tiktok-assistant",
        name: "AI Tiktok Assistant",
        tool_count: 298,
      },
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2536,
      },
      {
        handle: "other",
        name: "Other",
        tool_count: 2958,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800270,
    is_ad: true,
    website_name: "Teammates.ai",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250411/1744350942_20790031_24407.webp",
  },
  {
    website: "https://www.tripo3d.ai?utm_source=toolify",
    collected_count: 27,
    description: "Generate 3D Model Powered by Al in ONE CLICK, within Seconds",
    handle: "tripo-ai",
    id: 8573,
    image: "https://cdn-images.toolify.ai/user-upload/1744277178_53200482",
    month_visited_count: 1344580,
    name: "Tripo AI",
    user_collected: 0,
    what_is_summary:
      "Generate 3D Model Powered by Al in ONE CLICK, within Seconds",
    traffic: {
      top_region: "CN",
      top_region_value: 0.27379061179067127,
    },
    categories: [
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1443,
      },
      {
        handle: "ai-interior-room-design",
        name: "AI Interior & Room Design",
        tool_count: 168,
      },
      {
        handle: "3d-model-generator",
        name: "AI 3D Model Generator",
        tool_count: 128,
      },
      {
        handle: "text-to-3d",
        name: "Text to 3D",
        tool_count: 37,
      },
      {
        handle: "image-to-3d-model",
        name: "Image to 3D Model",
        tool_count: 44,
      },
      {
        handle: "ai-word",
        name: "AI WORD",
        tool_count: 96,
      },
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 157,
      },
      {
        handle: "game",
        name: "Game",
        tool_count: 179,
      },
      {
        handle: "ai-profile-picture-generator",
        name: "AI Profile Picture Generator",
        tool_count: 438,
      },
      {
        handle: "ai-clothing-generator",
        name: "AI Clothing Generator",
        tool_count: 144,
      },
      {
        handle: "ai-design-generator",
        name: "AI Design Generator",
        tool_count: 780,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800280,
    is_ad: true,
    website_name: "Tripo 3D",
    extension: null,
    is_free: false,
    website_logo:
      "https://cdn-images.toolify.ai/website-logos/20250410/1744267936_15939468_8573.webp",
  },
];

export function JustLaunchedSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Just launched</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {todayListV1.map((tool) => (
          <div
            key={tool.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* <Link href={`/tools/${tool.handle}`} className="block"> */}
            <Link href={tool.website} className="block" target="_blank">
              <div className="relative h-40 bg-gray-100">
                {tool.image && (
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder.png";
                    }}
                  />
                )}
                {tool.is_ad && (
                  <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    广告
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">
                    {tool.name}
                  </h3>
                  <ExternalLink
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-2 h-2 mr-1"></span>
                  <span className="mr-4">--</span>
                  <span>👁 {tool.month_visited_count || 0}</span>
                  {tool.collected_count > 0 && (
                    <span className="ml-2">❤️ {tool.collected_count}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tool.description}
                </p>
                {tool.categories && tool.categories.length > 0 && (
                  <div className="mt-3 text-xs">
                    <span className="text-gray-500">
                      {tool.categories[0].name}
                    </span>
                    {tool.categories.length > 1 && (
                      <span className="text-gray-500 ml-2">
                        +{tool.categories.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
