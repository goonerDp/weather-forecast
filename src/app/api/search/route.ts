import { NextRequest, NextResponse } from "next/server";
import type { CitySearchResult } from "@/features/search/types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(q)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: res.status },
    );
  }

  const data = await res.json();

  const results: CitySearchResult[] = data.map(
    (item: { name: string; region: string; country: string }) => ({
      name: item.name,
      region: item.region,
      country: item.country,
    }),
  );

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
