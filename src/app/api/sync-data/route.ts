import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// API响应接口定义
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

const supabase = createServerClient();

/**
 * 保存工具数据到Supabase
 */
async function saveToolToSupabase(tool: ToolData, categoryHandle: string) {
  try {
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

    const { error, status } = await supabase
      .from("category_item_detail")
      .upsert(toolData, { onConflict: "id" });

    if (error) {
      console.error(`Error saving tool ${tool.id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in saveToolToSupabase for tool ${tool.id}:`, error);
    return false;
  }
}

/**
 * 获取并保存指定分类的工具数据
 */
async function fetchAndSaveToolifyData(handle: string, maxPages = 3) {
  let currentPage = 1;
  let totalTools = 0;
  const startTime = Date.now();
  const MAX_EXECUTION_TIME = 4 * 60 * 1000; // 4分钟限制

  console.log(`开始获取分类数据: ${handle}`);

  while (currentPage <= maxPages) {
    // 检查执行时间
    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      console.log(`分类 ${handle} 达到时间限制`);
      break;
    }

    try {
      const apiUrl = `https://www.toolify.ai/self-api/v1/categories/detail-v1?handle=${handle}&order_by=category_correlation&page=${currentPage}&per_page=100`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API请求失败，状态码: ${response.status}`);
      }

      const responseData = (await response.json()) as ApiResponse;

      if (responseData.code !== 200 || !responseData.data?.data) {
        console.error(`分类 ${handle} 返回无效响应:`, responseData);
        break;
      }

      const pageTools = responseData.data.data;

      if (pageTools.length === 0) {
        console.log(`分类 ${handle} 没有更多数据`);
        break;
      }

      // 保存工具数据
      let savedCount = 0;
      for (const tool of pageTools) {
        const success = await saveToolToSupabase(tool, handle);
        if (success) savedCount++;
      }

      console.log(
        `分类 ${handle} 第${currentPage}页: 保存 ${savedCount}/${pageTools.length} 个工具`
      );
      totalTools += savedCount;
      currentPage++;

      // 如果返回的工具数量少于100，说明到了最后一页
      if (pageTools.length < 100) {
        break;
      }
    } catch (error) {
      console.error(`获取分类 ${handle} 第${currentPage}页数据时出错:`, error);
      break;
    }
  }

  console.log(`分类 ${handle} 处理完成，共处理 ${totalTools} 个工具`);
  return { totalTools, handle };
}

export async function POST(request: NextRequest) {
  try {
    // API密钥验证
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.SYNC_API_SECRET}`;

    // 如果设置了API密钥，则必须验证
    if (process.env.SYNC_API_SECRET) {
      if (!authHeader || authHeader !== expectedAuth) {
        console.error("未授权访问尝试:", {
          hasAuth: !!authHeader,
          authMatch: authHeader === expectedAuth,
        });
        return NextResponse.json({ error: "未授权访问" }, { status: 401 });
      }
    } else {
      console.warn("警告: SYNC_API_SECRET 未设置，跳过身份验证");
    }

    const body = await request.json().catch(() => ({}));
    const { categories, batchSize = 5, offset = 0 } = body;

    let categoriesToSync: string[] = [];

    if (!categories || !Array.isArray(categories)) {
      // 从数据库获取分类
      console.log("从数据库获取分类列表...");
      const { data: categoryValues, error } = await supabase
        .from("category_values")
        .select("handle")
        .order("tool_count", { ascending: false })
        .range(offset, offset + batchSize - 1);

      if (error) {
        console.error("获取分类失败:", error);
        return NextResponse.json({ error: "获取分类失败" }, { status: 500 });
      }

      categoriesToSync = categoryValues?.map((item) => item.handle) || [];
    } else {
      categoriesToSync = categories.slice(offset, offset + batchSize);
    }

    if (categoriesToSync.length === 0) {
      return NextResponse.json({
        success: true,
        message: "没有需要同步的分类",
        results: [],
        totalTools: 0,
      });
    }

    console.log(`开始同步分类: ${categoriesToSync.join(", ")}`);

    const results = [];
    for (const category of categoriesToSync) {
      const result = await fetchAndSaveToolifyData(category, 2); // 每个分类最多2页，减少执行时间
      results.push(result);
    }

    const totalTools = results.reduce((sum, r) => sum + r.totalTools, 0);

    console.log(`同步完成，共处理 ${totalTools} 个工具`);

    return NextResponse.json({
      success: true,
      message: `成功同步 ${results.length} 个分类`,
      results,
      totalTools,
      processedCategories: categoriesToSync,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("同步API错误:", error);

    // 记录详细的错误信息用于调试
    const errorDetails = {
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestInfo: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
      },
    };

    console.error("详细错误信息:", errorDetails);

    return NextResponse.json(
      {
        error: "内部服务器错误",
        details: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// 支持GET请求用于健康检查
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "数据同步API运行正常",
    timestamp: new Date().toISOString(),
  });
}
