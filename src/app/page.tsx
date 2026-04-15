import { Suspense } from "react";
import { SearchCombobox } from "@/features/search/search-combobox";
import { WeatherSection } from "@/features/weather/weather-section";
import { WeatherCardSkeleton } from "@/features/weather/weather-card-skeleton";
import { ThemeSwitcher } from "@/features/theme/theme-switcher";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;

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
          <SearchCombobox defaultValue={city ?? ""} />
        </section>
        <section aria-label="Weather details">
          {city ? (
            <Suspense key={city} fallback={<WeatherCardSkeleton />}>
              <WeatherSection city={city} />
            </Suspense>
          ) : (
            <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/40">
              Enter a city name above to get started
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
