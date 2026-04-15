import { NextRequest, NextResponse } from "next/server";
import { fetchForecast } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const daysParam = request.nextUrl.searchParams.get("days");
  const days = parseInt(daysParam || "1", 10) || 1;

  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchForecast(city, days);
    if (!data) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch weather data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
