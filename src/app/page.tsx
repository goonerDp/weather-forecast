import { fetchForecast } from "@/lib/weather";
import { SearchCombobox } from "@/features/search/search-combobox";
import { WeatherCard } from "@/features/weather/weather-card";
import { formatLocation } from "@/features/weather/format-location";
import { ThemeSwitcher } from "@/features/theme/theme-switcher";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const forecastData = city ? await fetchForecast(city) : null;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <div className="flex justify-end">
            <ThemeSwitcher />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Weather Forecast
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Search for a city to check current conditions
          </p>
        </header>
        <section aria-label="City search">
          <SearchCombobox
            defaultValue={
              forecastData ? formatLocation(forecastData) : (city ?? "")
            }
          />
        </section>
        <section aria-label="Weather details">
          {forecastData && <WeatherCard data={forecastData} />}
          {!forecastData && city && (
            <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/60">
              No results for &ldquo;{city}&rdquo;. Try another city.
            </div>
          )}
          {!forecastData && !city && (
            <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/40">
              Enter a city name above to get started
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
