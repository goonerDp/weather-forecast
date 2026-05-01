import { NextRequest, NextResponse } from "next/server";
import { fetchForecast } from "@/features/weather";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city || city.trim().length === 0) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }

  let data;
  try {
    data = await fetchForecast(city);
  } catch (error) {
    console.error("Forecast fetch failed", error);
    return NextResponse.json(
      { error: "Upstream forecast service unreachable" },
      { status: 502 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
