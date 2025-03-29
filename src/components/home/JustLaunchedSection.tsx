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
    website: "https://poweredby.agency?utm_source=toolify",
    collected_count: 6,
    description:
      "Custom AI agents tailored for small and medium-sized businesses.",
    handle: "powered-by",
    id: 25498,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174237581551779576.jpg",
    month_visited_count: 0,
    name: "Powered_By",
    user_collected: 0,
    what_is_summary:
      "Custom AI agents tailored for small and medium-sized businesses.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-voice-assistants",
        name: "AI Voice Assistants",
        tool_count: 367,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800271,
    is_ad: false,
    website_name: "Powered_By",
    extension: null,
  },
  {
    website: "https://ghibliimagegenerator.com?utm_source=toolify",
    collected_count: 0,
    description: "AI tool to transform images into Ghibli-style art",
    handle: "ghibli-image-generator",
    id: 25999,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174323621271288247.jpg",
    month_visited_count: 0,
    name: "Ghibli Image Generator",
    user_collected: 0,
    what_is_summary: "AI tool to transform images into Ghibli-style art",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1391,
      },
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 143,
      },
      {
        handle: "ai-tutorial",
        name: "AI Tutorial",
        tool_count: 467,
      },
      {
        handle: "prompt-1",
        name: "Prompt",
        tool_count: 729,
      },
      {
        handle: "ai-photo-image-generator",
        name: "AI Photo & Image Generator",
        tool_count: 1983,
      },
      {
        handle: "ai-illustration-generator",
        name: "AI Illustration Generator",
        tool_count: 483,
      },
      {
        handle: "ai-background-generator",
        name: "AI Background Generator",
        tool_count: 345,
      },
      {
        handle: "ai-landscape-generator",
        name: "AI Landscape Generator",
        tool_count: 23,
      },
      {
        handle: "ai-anime-cartoon-generator",
        name: "AI Anime & Cartoon Generator",
        tool_count: 146,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: null,
    is_ad: false,
    website_name: "Ghibli Image Generator",
    extension: null,
  },
  {
    website: "https://ghibliart.ai?utm_source=toolify",
    collected_count: 0,
    description:
      "Create magical Ghibli-style images from photos and text – free and easy!",
    handle: "ghibli-art-ai-free-online-ghibli-style-art-generator",
    id: 25998,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174322883313044874.jpg",
    month_visited_count: 0,
    name: "Ghibli Art AI: Free Online Ghibli-Style Art Generator",
    user_collected: 0,
    what_is_summary:
      "Create magical Ghibli-style images from photos and text – free and easy!",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-photo-image-generator",
        name: "AI Photo & Image Generator",
        tool_count: 1983,
      },
      {
        handle: "image-to-image",
        name: "Image to Image",
        tool_count: 481,
      },
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1391,
      },
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 143,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: null,
    is_ad: false,
    website_name: "Ghibli Art AI: Free Online Ghibli-Style Art Generator",
    extension: null,
  },
  {
    website: "http://aighibli.ai?utm_source=toolify",
    collected_count: 0,
    description:
      "AI generator for creating Ghibli-style artwork from photos or text.",
    handle: "ghibli-ai-free",
    id: 25997,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174321485796822103.jpg",
    month_visited_count: 0,
    name: "Ghibli AI Free",
    user_collected: 0,
    what_is_summary:
      "AI generator for creating Ghibli-style artwork from photos or text.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1391,
      },
      {
        handle: "text-to-image",
        name: "Text to Image",
        tool_count: 795,
      },
      {
        handle: "ai-photo-image-generator",
        name: "AI Photo & Image Generator",
        tool_count: 1983,
      },
      {
        handle: "ai-illustration-generator",
        name: "AI Illustration Generator",
        tool_count: 483,
      },
      {
        handle: "ai-background-generator",
        name: "AI Background Generator",
        tool_count: 345,
      },
      {
        handle: "image-to-image",
        name: "Image to Image",
        tool_count: 481,
      },
      {
        handle: "ai-cosplay-generator",
        name: "AI Cosplay Generator",
        tool_count: 18,
      },
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 143,
      },
      {
        handle: "ai-character",
        name: "AI Character",
        tool_count: 456,
      },
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1407,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: null,
    is_ad: false,
    website_name: "Ghibli AI",
    extension: null,
  },
  {
    website: "https://hackathonparty.com?utm_source=toolify",
    collected_count: 1,
    description:
      "Platform for real-time hackathon team facilitation and support.",
    handle: "hackathonparty",
    id: 25996,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315397282791922.jpg",
    month_visited_count: 119,
    name: "HackathonParty",
    user_collected: 0,
    what_is_summary:
      "Platform for real-time hackathon team facilitation and support.",
    traffic: {
      top_region: "RU",
      top_region_value: 0.8628306516564653,
    },
    categories: [
      {
        handle: "ai-team-collaboration",
        name: "AI Team Collaboration",
        tool_count: 358,
      },
      {
        handle: "ai-project-management",
        name: "AI Project Management",
        tool_count: 405,
      },
      {
        handle: "ai-code-assistant",
        name: "AI Code Assistant",
        tool_count: 581,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "HackathonParty",
    extension: null,
  },
  {
    website: "https://xautodm.com?utm_source=toolify",
    collected_count: 0,
    description: "AI-driven Twitter DM automation for higher conversions.",
    handle: "xautodm",
    id: 25994,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396892964619.jpg",
    month_visited_count: 0,
    name: "xAutoDM",
    user_collected: 0,
    what_is_summary: "AI-driven Twitter DM automation for higher conversions.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1407,
      },
      {
        handle: "ai-twitter-assistant",
        name: "AI Twitter Assistant",
        tool_count: 373,
      },
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1277,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4064,
      },
      {
        handle: "copywriting",
        name: "Copywriting",
        tool_count: 893,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "xAutoDM",
    extension: null,
  },
  {
    website: "https://reachfast.ai?utm_source=toolify",
    collected_count: 0,
    description: "Find direct contact details using LinkedIn URLs.",
    handle: "reachfast-ai",
    id: 25995,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396810189449.jpg",
    month_visited_count: 5932,
    name: "Reachfast.ai",
    user_collected: 0,
    what_is_summary: "Find direct contact details using LinkedIn URLs.",
    traffic: {
      top_region: "IN",
      top_region_value: 1,
    },
    categories: [
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1277,
      },
      {
        handle: "ai-recruiting",
        name: "AI Recruiting",
        tool_count: 662,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Reachfast",
    extension: null,
  },
  {
    website: "https://ifable.ai?utm_source=toolify",
    collected_count: 4,
    description:
      "Your Personal Anime Universe Generated by AI: Where Every Character is Uniquely Yours",
    handle: "ifable",
    id: 25467,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/user-upload/1742892281_91005570",
    month_visited_count: 0,
    name: "iFable",
    user_collected: 0,
    what_is_summary:
      "Your Personal Anime Universe Generated by AI: Where Every Character is Uniquely Yours",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-story-writing",
        name: "AI Story Writing",
        tool_count: 472,
      },
      {
        handle: "ai-illustration-generator",
        name: "AI Illustration Generator",
        tool_count: 483,
      },
      {
        handle: "ai-avatar-generator",
        name: "AI Avatar Generator",
        tool_count: 410,
      },
      {
        handle: "ai-manga-comic",
        name: "AI Manga & Comic",
        tool_count: 63,
      },
      {
        handle: "ai-anime-cartoon-generator",
        name: "AI Anime & Cartoon Generator",
        tool_count: 146,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3353,
      },
      {
        handle: "ai-character",
        name: "AI Character",
        tool_count: 456,
      },
      {
        handle: "ai-anime-ai-art",
        name: "AI Anime Art",
        tool_count: 143,
      },
      {
        handle: "game",
        name: "Game",
        tool_count: 169,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800273,
    is_ad: true,
    website_name: "iFable",
    extension: null,
  },
  {
    website: "https://readytosend.ai?utm_source=toolify",
    collected_count: 0,
    description: "A lead generation tool for email enrichment and validation.",
    handle: "readytosend",
    id: 25991,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396248618500.jpg",
    month_visited_count: 0,
    name: "ReadyToSend",
    user_collected: 0,
    what_is_summary:
      "A lead generation tool for email enrichment and validation.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-email-marketing",
        name: "AI Email Marketing",
        tool_count: 826,
      },
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1277,
      },
      {
        handle: "ai-email-writer",
        name: "AI Email Writer",
        tool_count: 796,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "ReadyToSend",
    extension: null,
  },
  {
    website:
      "https://play.google.com/store/apps/details?id=ai.x.grok&utm_source=toolify",
    collected_count: 0,
    description: "AI assistant for answering questions and generating images.",
    handle: "grok-for-android",
    id: 25993,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396666670123.jpg",
    month_visited_count: 0,
    name: "Grok for Android",
    user_collected: 0,
    what_is_summary:
      "AI assistant for answering questions and generating images.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1391,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1107,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3353,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4064,
      },
      {
        handle: "text-to-image",
        name: "Text to Image",
        tool_count: 795,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 2941,
      },
      {
        handle: "ai-photo-image-generator",
        name: "AI Photo & Image Generator",
        tool_count: 1983,
      },
      {
        handle: "ai-voice-assistants",
        name: "AI Voice Assistants",
        tool_count: 367,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Grok",
    extension: null,
  },
  {
    website: "https://cursio.com.br?utm_source=toolify",
    collected_count: 0,
    description: "Transform YouTube playlists into structured courses easily.",
    handle: "cursio",
    id: 25987,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315395418410584.jpg",
    month_visited_count: 0,
    name: "Cursio",
    user_collected: 0,
    what_is_summary:
      "Transform YouTube playlists into structured courses easily.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 584,
      },
      {
        handle: "ai-tutorial",
        name: "AI Tutorial",
        tool_count: 467,
      },
      {
        handle: "ai-course",
        name: "AI Course",
        tool_count: 367,
      },
      {
        handle: "ai-education-assistant",
        name: "AI Education Assistant",
        tool_count: 753,
      },
      {
        handle: "ai-mind-mapping",
        name: "AI Mind Mapping",
        tool_count: 70,
      },
      {
        handle: "ai-video-editor",
        name: "AI Video Editor",
        tool_count: 318,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Cursio",
    extension: null,
  },
  {
    website: "https://dreammachineai.online/image-to-video?utm_source=toolify",
    collected_count: 0,
    description: "AI tool that converts images and text into stunning videos.",
    handle: "dreammachineai-online",
    id: 25989,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315395966446005.jpg",
    month_visited_count: 626,
    name: "dreammachineai.online",
    user_collected: 0,
    what_is_summary:
      "AI tool that converts images and text into stunning videos.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-tutorial",
        name: "AI Tutorial",
        tool_count: 467,
      },
      {
        handle: "ai-video-recording",
        name: "AI Video Recording",
        tool_count: 261,
      },
      {
        handle: "image-to-video",
        name: "Image to Video",
        tool_count: 125,
      },
      {
        handle: "text-to-video",
        name: "Text to Video",
        tool_count: 358,
      },
      {
        handle: "ai-video-generator",
        name: "AI Video Generator",
        tool_count: 496,
      },
      {
        handle: "ai-animated-video",
        name: "AI Animated Video",
        tool_count: 219,
      },
      {
        handle: "ai-art-generator",
        name: "AI Art Generator",
        tool_count: 1391,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Dream Machine AI",
    extension: null,
  },
  {
    website: "https://supavoice.app?utm_source=toolify",
    collected_count: 0,
    description:
      "Voice-to-text app for macOS with smart formatting capabilities.",
    handle: "supavoice",
    id: 25986,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315395254344968.jpg",
    month_visited_count: 0,
    name: "Supavoice",
    user_collected: 0,
    what_is_summary:
      "Voice-to-text app for macOS with smart formatting capabilities.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1107,
      },
      {
        handle: "transcription",
        name: "Transcription",
        tool_count: 591,
      },
      {
        handle: "transcriber",
        name: "Transcriber",
        tool_count: 505,
      },
      {
        handle: "ai-email-writer",
        name: "AI Email Writer",
        tool_count: 796,
      },
      {
        handle: "speech-to-text",
        name: "Speech-to-Text",
        tool_count: 500,
      },
      {
        handle: "ai-speech-recognition",
        name: "AI Speech Recognition",
        tool_count: 377,
      },
      {
        handle: "ai-email-assistant",
        name: "AI Email Assistant",
        tool_count: 1026,
      },
      {
        handle: "ai-notes-assistant",
        name: "AI Notes Assistant",
        tool_count: 389,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Supavoice",
    extension: null,
  },
  {
    website: "https://yaprap.net?utm_source=toolify",
    collected_count: 0,
    description:
      "An app for improving communication and creativity through fun exercises.",
    handle: "yaprap",
    id: 25988,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315395545321785.jpg",
    month_visited_count: 834,
    name: "YapRap",
    user_collected: 0,
    what_is_summary:
      "An app for improving communication and creativity through fun exercises.",
    traffic: {
      top_region: "US",
      top_region_value: 0.6275316624291245,
    },
    categories: [
      {
        handle: "prompt-1",
        name: "Prompt",
        tool_count: 729,
      },
      {
        handle: "ai-video-recording",
        name: "AI Video Recording",
        tool_count: 261,
      },
      {
        handle: "fun-tools",
        name: "Fun Tools",
        tool_count: 83,
      },
      {
        handle: "transcription",
        name: "Transcription",
        tool_count: 591,
      },
      {
        handle: "transcriber",
        name: "Transcriber",
        tool_count: 505,
      },
      {
        handle: "recording",
        name: "Recording",
        tool_count: 156,
      },
      {
        handle: "speech-to-text",
        name: "Speech-to-Text",
        tool_count: 500,
      },
      {
        handle: "ai-speech-recognition",
        name: "AI Speech Recognition",
        tool_count: 377,
      },
      {
        handle: "ai-lyrics-generator",
        name: "AI Lyrics Generator",
        tool_count: 104,
      },
      {
        handle: "ai-rap-generator",
        name: "AI Rap Generator",
        tool_count: 21,
      },
      {
        handle: "ai-creative-writing",
        name: "AI Creative Writing",
        tool_count: 597,
      },
      {
        handle: "ai-story-writing",
        name: "AI Story Writing",
        tool_count: 472,
      },
      {
        handle: "ai-poem-poetry-generator",
        name: "AI Poem & Poetry Generator",
        tool_count: 69,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "YapRap",
    extension: null,
  },
  {
    website: "https://mirloe.com?utm_source=toolify",
    collected_count: 0,
    description:
      "Turn competitor reviews into customers through automated outreach.",
    handle: "mirloe",
    id: 25990,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396020846226.jpg",
    month_visited_count: 0,
    name: "mirloe",
    user_collected: 0,
    what_is_summary:
      "Turn competitor reviews into customers through automated outreach.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-reviews-assistant",
        name: "AI Reviews Assistant",
        tool_count: 325,
      },
      {
        handle: "ai-lead-generation",
        name: "AI Lead Generation",
        tool_count: 1277,
      },
      {
        handle: "copywriting",
        name: "Copywriting",
        tool_count: 893,
      },
      {
        handle: "general-writing",
        name: "General Writing",
        tool_count: 966,
      },
      {
        handle: "ai-email-writer",
        name: "AI Email Writer",
        tool_count: 796,
      },
      {
        handle: "ai-product-description-generator",
        name: "AI Product Description Generator",
        tool_count: 2158,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "mirloe",
    extension: null,
  },
  {
    website: "https://www.sayfluent.com?utm_source=toolify",
    collected_count: 0,
    description:
      "AI-driven platform using YouTube for English language learning.",
    handle: "sayfluent",
    id: 25992,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315396187264766.jpg",
    month_visited_count: 0,
    name: "SayFluent",
    user_collected: 0,
    what_is_summary:
      "AI-driven platform using YouTube for English language learning.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-youtube-assistant",
        name: "AI YouTube Assistant",
        tool_count: 584,
      },
      {
        handle: "ai-coaching",
        name: "AI Coaching",
        tool_count: 309,
      },
      {
        handle: "ai-course",
        name: "AI Course",
        tool_count: 367,
      },
      {
        handle: "ai-education-assistant",
        name: "AI Education Assistant",
        tool_count: 753,
      },
      {
        handle: "captions-or-subtitle",
        name: "Captions or Subtitle",
        tool_count: 480,
      },
      {
        handle: "ai-script-writing",
        name: "AI Script Writing",
        tool_count: 244,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "SayFluent",
    extension: null,
  },
  {
    website: "https://tweet.xundan.in?utm_source=toolify",
    collected_count: 0,
    description:
      "AI-powered automation for effective Twitter management and engagement.",
    handle: "x-agent",
    id: 25978,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315393591941960.jpg",
    month_visited_count: 0,
    name: "X Agent",
    user_collected: 0,
    what_is_summary:
      "AI-powered automation for effective Twitter management and engagement.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2469,
      },
      {
        handle: "ai-reply-assistant",
        name: "AI Reply Assistant",
        tool_count: 1541,
      },
      {
        handle: "ai-social-media-assistant",
        name: "AI Social Media Assistant",
        tool_count: 1407,
      },
      {
        handle: "ai-twitter-assistant",
        name: "AI Twitter Assistant",
        tool_count: 373,
      },
      {
        handle: "ai-scheduling",
        name: "AI Scheduling",
        tool_count: 330,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4064,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "X Agent",
    extension: null,
  },
  {
    website: "https://heroui.chat?utm_source=toolify",
    collected_count: 0,
    description: "AI tool for turning design ideas into React code.",
    handle: "heroui-chat",
    id: 25983,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315394451680183.jpg",
    month_visited_count: 0,
    name: "HeroUI Chat",
    user_collected: 0,
    what_is_summary: "AI tool for turning design ideas into React code.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-design-generator",
        name: "AI Design Generator",
        tool_count: 746,
      },
      {
        handle: "ai-graphic-design",
        name: "AI Graphic Design",
        tool_count: 628,
      },
      {
        handle: "design-assistant",
        name: "Design Assistant",
        tool_count: 489,
      },
      {
        handle: "ai-website-designer",
        name: "AI Website Designer",
        tool_count: 501,
      },
      {
        handle: "ai-forms-surveys",
        name: "AI Forms & Surveys",
        tool_count: 155,
      },
      {
        handle: "prompt-1",
        name: "Prompt",
        tool_count: 729,
      },
      {
        handle: "ai-landing-page-builder",
        name: "AI Landing Page Builder",
        tool_count: 250,
      },
      {
        handle: "ai-website-builder",
        name: "AI Website Builder",
        tool_count: 523,
      },
      {
        handle: "no-code-low-code",
        name: "No-Code&Low-Code",
        tool_count: 486,
      },
      {
        handle: "ai-app-builder",
        name: "AI App Builder",
        tool_count: 467,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "HeroUI Chat",
    extension: null,
  },
  {
    website: "https://mcp.natoma.id?utm_source=toolify",
    collected_count: 0,
    description:
      "Managed platform for easy AI development with prebuilt servers.",
    handle: "hosted-mcp-platform-natoma",
    id: 25980,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315393672775554.jpg",
    month_visited_count: 0,
    name: "Hosted MCP Platform | Natoma",
    user_collected: 0,
    what_is_summary:
      "Managed platform for easy AI development with prebuilt servers.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "large-language-models-(llms)",
        name: "Large Language Models (LLMs)",
        tool_count: 2333,
      },
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4064,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Natoma Hosted MCP Platform",
    extension: null,
  },
  {
    website: "https://www.amurex.ai?utm_source=toolify",
    collected_count: 0,
    description:
      "Amurex unifies workflows and organizes knowledge across existing tools.",
    handle: "amurex",
    id: 25979,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315393773866205.jpg",
    month_visited_count: 2769,
    name: "Amurex",
    user_collected: 0,
    what_is_summary:
      "Amurex unifies workflows and organizes knowledge across existing tools.",
    traffic: {
      top_region: "JP",
      top_region_value: 0.7403317523814696,
    },
    categories: [
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1107,
      },
      {
        handle: "ai-meeting-assistant",
        name: "AI Meeting Assistant",
        tool_count: 290,
      },
      {
        handle: "ai-workflow-management",
        name: "AI Workflow Management",
        tool_count: 696,
      },
      {
        handle: "summarizer",
        name: "Summarizer",
        tool_count: 1182,
      },
      {
        handle: "transcription",
        name: "Transcription",
        tool_count: 591,
      },
      {
        handle: "transcriber",
        name: "Transcriber",
        tool_count: 505,
      },
      {
        handle: "ai-email-writer",
        name: "AI Email Writer",
        tool_count: 796,
      },
      {
        handle: "writing-assistants",
        name: "Writing Assistants",
        tool_count: 2941,
      },
      {
        handle: "ai-task-management",
        name: "AI Task Management",
        tool_count: 558,
      },
      {
        handle: "life-assistant-2",
        name: "Life Assistant",
        tool_count: 223,
      },
      {
        handle: "ai-knowledge-base",
        name: "AI Knowledge Base",
        tool_count: 733,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Amurex",
    extension: null,
  },
  {
    website: "https://www.hifrontstreet.com?utm_source=toolify",
    collected_count: 0,
    description:
      "Automatically track purchases and gain insights through loyalty integration.",
    handle: "front-street",
    id: 25985,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315395157989808.jpg",
    month_visited_count: 0,
    name: "Front Street",
    user_collected: 0,
    what_is_summary:
      "Automatically track purchases and gain insights through loyalty integration.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2469,
      },
      {
        handle: "e-commerce-assistant",
        name: "E-commerce Assistant",
        tool_count: 427,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Front Street",
    extension: null,
  },
  {
    website: "https://freebot.ai?utm_source=toolify",
    collected_count: 0,
    description: "AI tool simplifying customer service interactions for users.",
    handle: "freebot",
    id: 25981,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315394731550033.jpg",
    month_visited_count: 0,
    name: "Freebot",
    user_collected: 0,
    what_is_summary:
      "AI tool simplifying customer service interactions for users.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-customer-service-assistant",
        name: "AI Customer Service Assistant",
        tool_count: 1398,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Freebot",
    extension: null,
  },
  {
    website: "https://flockx.io?utm_source=toolify",
    collected_count: 0,
    description: "A platform for creating and connecting AI agents seamlessly.",
    handle: "flockx",
    id: 25984,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315394610450175.jpg",
    month_visited_count: 1285,
    name: "Flockx",
    user_collected: 0,
    what_is_summary:
      "A platform for creating and connecting AI agents seamlessly.",
    traffic: {
      top_region: "US",
      top_region_value: 1,
    },
    categories: [
      {
        handle: "ai-knowledge-base",
        name: "AI Knowledge Base",
        tool_count: 733,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3353,
      },
      {
        handle: "no-code-low-code",
        name: "No-Code&Low-Code",
        tool_count: 486,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Flockx",
    extension: null,
  },
  {
    website: "https://internet.io?utm_source=toolify",
    collected_count: 0,
    description: "A platform for comparing insights from multiple AI engines.",
    handle: "internet-io",
    id: 25982,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315394541100297.jpg",
    month_visited_count: 0,
    name: "Internet.io",
    user_collected: 0,
    what_is_summary:
      "A platform for comparing insights from multiple AI engines.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-content-generator",
        name: "AI Content Generator",
        tool_count: 4064,
      },
      {
        handle: "ai-chatbot",
        name: "AI Chatbot",
        tool_count: 3353,
      },
      {
        handle: "ai-analytics-assistant",
        name: "AI Analytics Assistant",
        tool_count: 2469,
      },
      {
        handle: "ai-customer-service-assistant",
        name: "AI Customer Service Assistant",
        tool_count: 1398,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Internet.io",
    extension: null,
  },
  {
    website: "https://ehva.ai?utm_source=toolify",
    collected_count: 0,
    description: "Conversational AI by Phone - Customer Service, Sales, More.",
    handle: "ehva-ai",
    id: 25796,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174295220374098223.jpg",
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
        tool_count: 2948,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: 1709800274,
    is_ad: true,
    website_name: "EHVA.ai",
    extension: null,
  },
  {
    website: "https://usefenn.com?utm_source=toolify",
    collected_count: 0,
    description: "AI-powered file search engine for macOS users.",
    handle: "fenn",
    id: 25977,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315393663866051.jpg",
    month_visited_count: 0,
    name: "Fenn",
    user_collected: 0,
    what_is_summary: "AI-powered file search engine for macOS users.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-word",
        name: "AI WORD",
        tool_count: 91,
      },
      {
        handle: "ai-pdf",
        name: "AI PDF",
        tool_count: 301,
      },
      {
        handle: "ai-productivity-tools",
        name: "AI Productivity Tools",
        tool_count: 1107,
      },
      {
        handle: "ai-document-extraction",
        name: "AI Document Extraction",
        tool_count: 343,
      },
      {
        handle: "ai-documents-assistant",
        name: "AI Documents Assistant",
        tool_count: 239,
      },
      {
        handle: "ai-files-assistant",
        name: "AI Files Assistant",
        tool_count: 120,
      },
      {
        handle: "ai-image-scanning",
        name: "AI Image Scanning",
        tool_count: 138,
      },
      {
        handle: "ai-video-search",
        name: "AI Video Search",
        tool_count: 43,
      },
      {
        handle: "ai-search-engine",
        name: "AI Search Engine",
        tool_count: 306,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 2,
    advertisement_id: null,
    is_ad: false,
    website_name: "Fenn",
    extension: null,
  },
  {
    website: "https://candidatescreenings.com?utm_source=toolify",
    collected_count: 0,
    description: "Streamlines hiring with AI-driven candidate evaluation.",
    handle: "cndts-screening",
    id: 25976,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174315270067935097.jpg",
    month_visited_count: 0,
    name: "CNDTS Screening",
    user_collected: 0,
    what_is_summary: "Streamlines hiring with AI-driven candidate evaluation.",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "ai-interview-assistant",
        name: "AI Interview Assistant",
        tool_count: 382,
      },
      {
        handle: "ai-recruiting",
        name: "AI Recruiting",
        tool_count: 662,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: null,
    is_ad: false,
    website_name: "CNDTS Screening",
    extension: null,
  },
  {
    website: "https://wavespeed.ai?utm_source=toolify",
    collected_count: 1,
    description:
      "Bring the Fastest and Most Efficient AI Video & Image Generation to the World",
    handle: "wavespeedai",
    id: 25975,
    image:
      "https://nav-station.oss-accelerate.aliyuncs.com/174314437242795209.png",
    month_visited_count: 0,
    name: "WaveSpeedAI",
    user_collected: 0,
    what_is_summary:
      "Bring the Fastest and Most Efficient AI Video & Image Generation to the World",
    traffic: {
      top_region: null,
      top_region_value: null,
    },
    categories: [
      {
        handle: "text-to-image",
        name: "Text to Image",
        tool_count: 795,
      },
      {
        handle: "ai-photo-image-generator",
        name: "AI Photo & Image Generator",
        tool_count: 1983,
      },
      {
        handle: "image-to-image",
        name: "Image to Image",
        tool_count: 481,
      },
      {
        handle: "image-to-video",
        name: "Image to Video",
        tool_count: 125,
      },
      {
        handle: "text-to-video",
        name: "Text to Video",
        tool_count: 358,
      },
      {
        handle: "ai-video-generator",
        name: "AI Video Generator",
        tool_count: 496,
      },
    ],
    is_recommend_now: 0,
    is_noticeable: 1,
    advertisement_id: null,
    is_ad: false,
    website_name: "WaveSpeedAI",
    extension: null,
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
