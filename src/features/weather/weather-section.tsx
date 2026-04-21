import { fetchForecast } from "./fetch-forecast";
import { WeatherCard } from "./weather-card";

export async function WeatherSection({ city }: { city: string }) {
  const forecastData = await fetchForecast(city);

  if (!forecastData) {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/60">
        No results for &ldquo;{city}&rdquo;. Try another city.
      </div>
    );
  }

  return <WeatherCard data={forecastData} />;
}
