import { NextResponse } from "next/server";
import { createServerClient } from "../../../db/supabase/client";

export async function GET() {
  try {
    const supabase = createServerClient();

    // 获取最近同步的数据统计
    const { data, error } = await supabase
      .from("category_item_detail")
      .select("category_handle")
      .order("id", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("数据库查询错误:", error);
      return NextResponse.json({ error: "数据库查询失败" }, { status: 500 });
    }

    // 统计各分类的工具数量
    const categoryStats =
      data?.reduce((acc, item) => {
        acc[item.category_handle] = (acc[item.category_handle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    // 获取总数
    const { count, error: countError } = await supabase
      .from("category_item_detail")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("统计查询错误:", countError);
    }

    return NextResponse.json({
      success: true,
      totalTools: count || 0,
      recentSample: data?.length || 0,
      categoryStats,
      topCategories: Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([handle, count]) => ({ handle, count })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("状态API错误:", error);
    return NextResponse.json(
      {
        error: "内部服务器错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
