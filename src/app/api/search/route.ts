import { NextRequest, NextResponse } from "next/server";
import type { CitySearchResult } from "@/features/search/types";
import { getSearchUrl } from "@/lib/weather-api";

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

  const url = getSearchUrl(apiKey, q);

  let res: Response;

  try {
    res = await fetch(url, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Upstream search fetch failed", error);
    return NextResponse.json(
      { error: "Upstream search service unreachable" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: res.status },
    );
  }

  const data = await res.json();

  const results: CitySearchResult[] = data.map(
    (item: { id: number; name: string; region: string; country: string }) => ({
      id: item.id,
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
