import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.ogaflow.com/public/plans", {
      // Always fetch fresh data for the landing page
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch plans" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
