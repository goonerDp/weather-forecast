import { fetchForecast } from "@/lib/weather";
import { CitySearch } from "./city-search";
import { WeatherCard } from "./weather-card";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;

  let weather = null;
  let error = null;

  if (city) {
    try {
      weather = await fetchForecast(city);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to fetch weather data";
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Weather Forecast
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Search for a city to check current conditions
          </p>
        </header>

        <section aria-label="City search">
          <CitySearch
            defaultValue={
              weather
                ? `${weather.city}, ${weather.region}, ${weather.country}`
                : city ?? ""
            }
          />
        </section>

        <section aria-label="Weather details">
          {error && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {!error && weather && <WeatherCard data={weather} />}

          {!error && !weather && (
            <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/40">
              Enter a city name above to get started
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
