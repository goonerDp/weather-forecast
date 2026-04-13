import { NextRequest, NextResponse } from "next/server";
import type { WeatherData } from "@/types";

const MAX_DAYS = 3;
const REVALIDATE_SECONDS = 900; // 15 minutes

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const daysParam = request.nextUrl.searchParams.get("days");
  const days = Math.min(Math.max(parseInt(daysParam || "1", 10) || 1, 1), MAX_DAYS);

  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${days}`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    if (res.status === 400) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: res.status },
    );
  }

  const raw = await res.json();
  const forecast = raw.forecast.forecastday[0];

  const data: WeatherData = {
    city: raw.location.name,
    region: raw.location.region,
    country: raw.location.country,
    tempC: raw.current.temp_c,
    condition: raw.current.condition.text,
    conditionIcon: raw.current.condition.icon,
    minTempC: forecast.day.mintemp_c,
    maxTempC: forecast.day.maxtemp_c,
    windKph: raw.current.wind_kph,
    windDir: raw.current.wind_dir,
    feelsLikeC: raw.current.feelslike_c,
    humidity: raw.current.humidity,
    sunrise: forecast.astro.sunrise,
    sunset: forecast.astro.sunset,
  };

  return NextResponse.json(data);
}
