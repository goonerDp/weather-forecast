import type { WeatherData } from "@/types";

const REVALIDATE_SECONDS = 900; // 15 minutes
const MAX_DAYS = 3;

export async function fetchForecast(
  city: string,
  days: number = 1,
): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured");
  }

  const clampedDays = Math.min(Math.max(days, 1), MAX_DAYS);
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${clampedDays}`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    if (res.status === 400) {
      return null;
    }
    throw new Error("Failed to fetch weather data");
  }

  const raw = await res.json();
  const forecast = raw.forecast.forecastday[0];

  return {
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
    forecastDate: forecast.date,
    lastUpdated: raw.current.last_updated,
  };
}
