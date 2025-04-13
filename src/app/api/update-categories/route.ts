import { NextResponse } from "next/server";
import { fetchAndStoreCategoryData } from "@/lib/toolify-fetcher";

export async function GET(request: Request) {
  // Check for authorization - you can use a proper auth token
  const authHeader = request.headers.get("authorization");

  // Simple auth check - in production use a proper auth system
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_AUTH_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fetchAndStoreCategoryData();

    if (result.success) {
      return NextResponse.json(
        { message: "Categories updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json(
      { error: "Failed to update categories" },
      { status: 500 }
    );
  }
}
