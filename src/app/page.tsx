export default function Home() {
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

        {/* Search input area */}
        <section aria-label="City search">
          <div className="h-12 rounded-xl bg-foreground/5" />
        </section>

        {/* Weather content area */}
        <section aria-label="Weather details">
          <div className="rounded-2xl border border-foreground/10 p-6 text-center text-foreground/40">
            Enter a city name above to get started
          </div>
        </section>
      </div>
    </main>
  );
}
