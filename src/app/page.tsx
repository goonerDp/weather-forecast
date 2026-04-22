import { Suspense } from "react";
import { Search } from "@/features/search";
import {
  WeatherSection,
  WeatherCardSkeleton,
  WeatherErrorBoundary,
} from "@/features/weather";
import { ThemeSwitcher } from "@/features/theme";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <header className="text-center">
          <div className="flex justify-end mb-2">
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
          <Search defaultValue={city ?? ""} />
        </section>
        <section aria-label="Weather details">
          {city ? (
            <WeatherErrorBoundary key={city}>
              <Suspense fallback={<WeatherCardSkeleton />}>
                <WeatherSection city={city} />
              </Suspense>
            </WeatherErrorBoundary>
          ) : null}
        </section>
      </div>
    </main>
  );
}
