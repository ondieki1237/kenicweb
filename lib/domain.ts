import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Domain query is required" }, { status: 400 });
  }

  const url = `https://clients.hostnali.com/cart.php?a=add&domain=register&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text(); // Hostnali API returns HTML
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("[API] Error fetching domain:", error.message);
    return NextResponse.json({ error: "Failed to check domain availability" }, { status: 500 });
  }
}