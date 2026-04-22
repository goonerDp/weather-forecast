# Weather Forecast

A small Next.js app that looks up the current forecast for any city, keeps a short history of recent searches, and supports undoing accidental removals.

## Getting started

### Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- A free API key from [weatherapi.com](https://www.weatherapi.com/signup.aspx)

### Setup

```bash
pnpm install
cp .env.example .env
# then edit .env and set WEATHER_API_KEY=...
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command            | What it does                        |
| ------------------ | ----------------------------------- |
| `pnpm dev`         | Start the dev server with Turbopack |
| `pnpm build`       | Production build                    |
| `pnpm start`       | Run the production build            |
| `pnpm test`        | Run the Vitest suite (watch mode)   |
| `pnpm test run`    | Run the Vitest suite once           |
| `pnpm lint`        | ESLint across the project           |
| `pnpm check-types` | `tsc --noEmit`                      |
| `pnpm format`      | Prettier write                      |

## Architecture

The project follows a lightweight **feature-sliced** layout. Framework-level concerns live under `src/app/`; everything else is grouped by domain under `src/features/`.

### Data flow

- **Forecast** is fetched on the server (`src/features/weather/fetch-forecast.ts`) and streamed into the RSC via `<Suspense>` + `<WeatherErrorBoundary>` (`src/features/weather/weather-error-boundary.tsx`). The URL (`?city=Lviv`) is the source of truth — links and reloads are shareable.
- **Autocomplete** runs on the client. `useCitySearch` (`src/features/search/use-city-search.ts`) debounces the input, fetches through `/api/search` (the proxy in `src/app/api/search/route.ts`), and caches responses with SWR so repeated queries are free.
- **History** is stored in `localStorage` and exposed through `useSearchHistory` (`src/features/search/use-search-history.ts`), which uses `useSyncExternalStore` so React stays in sync with storage mutations — including cross-tab changes via the `storage` event.
- **Undo** is implemented by capturing the removed item's original index and restoring it via the HeroUI toast's action button (`src/features/search/history.tsx`).

### Environment

| Variable          | Required | Purpose                                              |
| ----------------- | -------- | ---------------------------------------------------- |
| `WEATHER_API_KEY` | yes      | Server-only key used by the forecast fetch and proxy |

The key is never sent to the browser — the client only talks to `/api/search`, which attaches the key server-side.

## Tech stack

Next.js 16 (App Router, React Server Components), React 19 with the React Compiler, SWR for client-side caching, HeroUI + Tailwind v4 for styling, `next-themes` for dark mode, Vitest for testing.
