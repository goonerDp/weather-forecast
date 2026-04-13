## Problem Statement

Users need a simple, polished way to check current weather conditions for any city. Existing weather websites are cluttered with ads and unnecessary complexity. We want a clean, fast, single-page weather app that remembers what cities a user has searched for and lets them quickly revisit past lookups.

## Solution

A single-page weather forecast application built with Next.js and React that lets users search for cities via an autocomplete input, displays current weather conditions in a visually polished card, and persists search history in the browser. The app uses WeatherAPI.com as its data source, proxied through a server-side API route to keep the API key hidden and enable caching.

The search input serves double duty: when focused and empty it shows recent search history; as the user types it shows city suggestions from the API. Selecting a city updates the URL query parameter (`/?city=CityName`), which triggers a weather data fetch and adds to browser history — enabling back/forward navigation and shareable/refreshable URLs.

## User Stories

1. As a user, I want to type a city name into a search input and see autocomplete suggestions, so that I can quickly find the city I'm looking for.
2. As a user, I want to select a city from the autocomplete suggestions, so that I can see its current weather conditions.
3. As a user, I want to see the current temperature displayed prominently, so that I can immediately know how warm or cold it is.
4. As a user, I want to see a weather description (e.g., "Partly Cloudy", "Sunny", "Rainy") with an accompanying weather icon, so that I can visually understand the conditions at a glance.
5. As a user, I want to see the minimum and maximum temperatures for the day, so that I can plan my activities accordingly.
6. As a user, I want to see the current wind speed, so that I can know if it's windy outside.
7. As a user, I want to see the "feels like" temperature, so that I can dress appropriately when wind or humidity makes it feel different from the actual temperature.
8. As a user, I want to see the current humidity percentage, so that I can gauge how muggy or dry it feels.
9. As a user, I want to see sunrise and sunset times for the city, so that I can plan around daylight hours.
10. As a user, I want the temperatures displayed in Celsius, so that I can read them in my preferred unit.
11. As a user, I want to see my search history when I focus the empty search input, so that I can quickly revisit a previously searched city.
12. As a user, I want to click on a history item to fetch the weather for that city, so that I don't have to retype city names.
13. As a user, I want to remove individual items from my search history, so that I can keep my history clean.
14. As a user, I want my search history to persist across browser sessions, so that I don't lose my history when I close the tab.
15. As a user, I want the search input to show only history OR only suggestions — never both at the same time, so that the dropdown is not confusing.
16. As a user, I want the selected city to appear in the URL (e.g., `/?city=London`), so that I can share the link or bookmark it.
17. As a user, I want browser back/forward navigation to work with my city searches, so that I can navigate between previously viewed cities.
18. As a user, I want the page to load the weather for the city in the URL on refresh, so that bookmarked or shared links work correctly.
19. As a user, I want to see an empty state message in the autocomplete when no cities match my query, so that I know the search found nothing rather than thinking it's still loading.
20. As a user, I want the app to look polished and visually appealing, so that it feels like a quality product.
21. As a user, I want the weather data to load quickly, so that I don't have to wait long after selecting a city.
22. As a user, I want to see a loading state while weather data is being fetched, so that I know the app is working.
23. As a user, I want to see a meaningful error state if something goes wrong (e.g., network failure), so that I know what happened.
24. **(Stretch)** As a user, I want to undo removing a history item, so that I can recover from accidental deletions.

## Implementation Decisions

### Architecture

- **Single-page app** with Next.js App Router. All interaction happens on the root page (`/`). The selected city is stored as a URL query parameter (`/?city=CityName`).
- **Server-side API proxy**: Two Next.js API routes sit between the client and WeatherAPI.com:
  - `/api/weather?city=<name>` — proxies to WeatherAPI `/forecast.json` with `days=1`. Returns a simplified, typed response containing only the fields the UI needs. Caches responses to reduce API calls.
  - `/api/search?q=<query>` — proxies to WeatherAPI `/search.json`. Returns city name suggestions for autocomplete.
- **Only the `/forecast` endpoint is used** — it is a superset of `/current` and provides current conditions, daily min/max, and sunrise/sunset in a single request.
- API key is stored in an environment variable (`WEATHER_API_KEY`) and never exposed to the client.

### Search & Autocomplete

- The autocomplete input has two modes, mutually exclusive:
  - **History mode**: Shown when the input is focused and empty. Displays saved search history from localStorage. Each item has a delete button.
  - **Suggestion mode**: Shown when the user has typed at least 1-2 characters. Displays city suggestions from the `/api/search` endpoint.
- Autocomplete requests are debounced to avoid excessive API calls.
- For ambiguous queries (e.g., "Springfield"), all matching cities are shown in the suggestion list with region/country to disambiguate (e.g., "Springfield, Illinois, United States").
- When no results match the query, an empty state message is shown (e.g., "No cities found").

### Weather Display

- A visually polished weather card showing:
  - Weather icon (from WeatherAPI CDN: `cdn.weatherapi.com`)
  - Current temperature (`temp_c`)
  - Weather description (`condition.text`)
  - Min/Max temperatures (`day.mintemp_c` / `day.maxtemp_c`)
  - Wind speed (`wind_kph`) with direction (`wind_dir`)
  - Feels like temperature (`feelslike_c`)
  - Humidity (`humidity` %)
  - Sunrise / Sunset (`astro.sunrise` / `astro.sunset`)
- All temperatures in Celsius.
- Weather icons served via the `condition.icon` URL from the API.

### Search History

- Stored in `localStorage` under a single key.
- Maximum of 10 items. When the limit is reached, the oldest entry is evicted.
- Deduplicated by city name — searching for the same city again moves it to the top rather than creating a duplicate.
- Each entry stores the city name (and optionally region/country for display).
- Individual items can be removed via a delete button in the history dropdown.
- **(Stretch)** Undo last removal via a temporary toast/snackbar notification.

### URL & Navigation

- Selecting a city sets `?city=CityName` using `useSearchParams` / `useRouter`.
- Browser back/forward buttons navigate between previously viewed cities.
- On page load, if `?city=` is present in the URL, the weather for that city is fetched automatically.
- If no city is in the URL, the page shows a welcome/empty state prompting the user to search.

### UI & Styling

- Built with HeroUI component library (already installed) and Tailwind CSS v4.
- Polished, modern design with attention to spacing, typography, and color.
- Responsive layout that works well on both desktop and mobile.
- Loading skeleton/spinner while fetching weather data.
- Smooth transitions for dropdown open/close.

### Caching

- The API route for weather data should cache responses for a reasonable duration (e.g., 15-30 minutes) since weather data doesn't change frequently. Implementation can use Next.js built-in fetch caching or in-memory caching.

## Testing Decisions

### What makes a good test

Tests should verify **external behavior** from the user's or consumer's perspective, not internal implementation details. A good test answers: "Does this module do what its consumers expect?" Tests should be resilient to refactoring — changing how something works internally should not break tests as long as the behavior is the same.

### Modules to test

1. **Search History Module** — This is a pure logic module with a clear interface (add, remove, get, undo). Test:
   - Adding a city to history
   - Deduplication (re-adding moves to top)
   - Max limit enforcement (oldest evicted)
   - Removing an individual item
   - Getting the full history list
   - Undo last removal (stretch)

2. **Weather Display Component** — Given weather data, verify the correct information renders. Test:
   - All required fields are displayed (temperature, description, icon, min/max, wind, feels like, humidity, sunrise/sunset)
   - Handles edge cases (missing data, extreme values)

3. **API Route** — Test the server-side proxy behavior. Test:
   - Returns correctly shaped response for a valid city
   - Returns appropriate error for invalid/unknown city
   - Handles WeatherAPI errors gracefully (500s, rate limits)

### Testing tools

- Vitest (already configured) as the test runner
- React Testing Library (already installed) for component tests
- Tests colocated with source files (existing pattern: `page.test.tsx`)

## Out of Scope

- **Multi-day forecast (3-day / 7-day)** — Can be added as a follow-up feature. The `/forecast` endpoint already supports `days=3`, so the API route is extensible.
- **Temperature unit toggle** (Celsius/Fahrenheit) — Celsius only for now.
- **Geolocation-based weather** — No auto-detection of user's location.
- **User accounts / server-side history** — History is browser-local only.
- **PWA / offline support** — Not in initial scope.
- **Dark mode** — Not in initial scope (can be added later with Tailwind).
- **Hourly forecast** — Data is available from the API but not displayed.
- **Internationalization (i18n)** — English only.

## Further Notes

- The WeatherAPI.com free tier allows 1,000,000 calls/month with the `/forecast` endpoint supporting up to 3 days. This is more than sufficient.
- The `/search.json` autocomplete endpoint returns results including `name`, `region`, and `country`, which can be used to disambiguate cities with the same name.
- Weather icons from `cdn.weatherapi.com` are served as 64x64 PNGs. These support day/night variants automatically via the `is_day` flag.
- The app uses Next.js 16, React 19, TypeScript, Tailwind CSS v4, and HeroUI — all already set up in the project.
