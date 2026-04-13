# Plan: Weather Forecast App

> Source PRD: prd.md

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: Single page at `/` with `?city=CityName` query param. Two API routes: `/api/search?q=<query>` and `/api/forecast?city=<name>`.
- **Data source**: WeatherAPI.com — only the `/forecast.json` endpoint (superset of `/current`), with `days=1`. `/search.json` for autocomplete.
- **API key**: Server-side only via `WEATHER_API_KEY` env var, never exposed to the client.
- **Schema (weather response)**: API routes return simplified, typed responses — only the fields the UI needs (temp_c, condition text/icon, min/max temps, wind_kph, wind_dir, feelslike_c, humidity, sunrise, sunset).
- **Search history**: localStorage, max 10 items, deduplicated by city name, client-side only.
- **UI stack**: HeroUI components + Tailwind CSS v4. Geist fonts already configured.
- **Testing**: Vitest + React Testing Library, tests colocated with source files.

---

## Phase 1: Layout shell

**User stories**: 20 (polished, quality feel)

### What to build

The root page layout that every subsequent phase builds inside. A centered, max-width container with an app title/header and placeholder areas for the search input and weather content. Responsive design that works on mobile and desktop. Establishes spacing, typography, and the visual frame.

### Acceptance criteria

- [x] Centered container with a sensible max-width
- [x] App title/header visible
- [x] Placeholder area for search input and weather content
- [x] Responsive — looks good on mobile and desktop
- [x] Uses HeroUI and Tailwind, consistent with project setup

---

## Phase 2: Search a city and see its weather

**User stories**: 1, 2, 3, 4, 16, 17, 18

### What to build

The core end-to-end flow. A search input with debounced autocomplete that calls `/api/search` and displays city suggestions (with region/country for disambiguation). Selecting a city sets `?city=CityName` in the URL and fetches weather data from `/api/forecast`. The weather card displays the current temperature, weather description, and weather icon. The `/api/forecast` route caches responses. Page load with `?city=` in the URL fetches weather automatically. Browser back/forward navigation works between previously viewed cities.

### Acceptance criteria

- [x] `/api/search?q=<query>` returns city suggestions from WeatherAPI
- [x] `/api/forecast?city=<name>` returns simplified weather data from WeatherAPI `/forecast.json`
- [x] `/api/forecast` caches responses to reduce API calls
- [x] Search input shows autocomplete suggestions as the user types
- [x] Autocomplete requests are debounced
- [x] Suggestions include region/country for disambiguation
- [x] Selecting a city updates the URL to `/?city=CityName`
- [x] Weather card shows current temperature, description, and icon
- [x] Page load with `?city=` fetches and displays weather
- [x] Browser back/forward navigates between previously viewed cities

---

## Phase 3: Complete weather details

**User stories**: 5, 6, 7, 8, 9, 10, 20

### What to build

Expand the weather card to display all required data fields: daily min/max temperatures, wind speed with direction, feels-like temperature, humidity percentage, and sunrise/sunset times. All temperatures in Celsius. The card should be visually polished with clear grouping and hierarchy of information.

### Acceptance criteria

- [ ] Min and max temperatures for the day are displayed
- [ ] Wind speed (kph) and direction are displayed
- [ ] Feels-like temperature is displayed
- [ ] Humidity percentage is displayed
- [ ] Sunrise and sunset times are displayed
- [ ] All temperatures shown in Celsius
- [ ] Layout is polished with clear visual hierarchy
- [ ] Responsive on mobile and desktop

---

## Phase 4: App states

**User stories**: 19, 21, 22, 23

### What to build

Handle all non-happy-path UI states. A loading skeleton or spinner while weather data is being fetched. An error state with a meaningful message when something goes wrong (network failure, invalid city, API errors). A welcome/empty state when no city is selected prompting the user to search. An empty results message in the autocomplete dropdown when no cities match the query.

### Acceptance criteria

- [ ] Loading skeleton/spinner shown while weather data is fetching
- [ ] Error state shown with meaningful message on failure
- [ ] Welcome/empty state shown when no city is in the URL
- [ ] Autocomplete shows "No cities found" when query returns no results
- [ ] Transitions between states are smooth

---

## Phase 5: Search history

**User stories**: 11, 12, 13, 14, 15, 24 (stretch)

### What to build

A search history module backed by localStorage. When the search input is focused and empty, the dropdown shows recent search history instead of suggestions (mutually exclusive — never both). Selecting a history item fetches weather for that city. Each history item has a delete button. History is deduplicated by city name (re-searching moves to top), capped at 10 items (oldest evicted), and persists across browser sessions. Stretch goal: undo last removal via a temporary toast/snackbar.

### Acceptance criteria

- [ ] Search history persists in localStorage across sessions
- [ ] History shown in dropdown when input is focused and empty
- [ ] Dropdown shows only history OR only suggestions, never both
- [ ] Clicking a history item fetches weather for that city
- [ ] Individual history items can be deleted
- [ ] Duplicate cities are deduplicated (re-search moves to top)
- [ ] History capped at 10 items, oldest evicted
- [ ] Search history module has unit tests (add, remove, get, deduplication, max limit)
- [ ] (Stretch) Undo last removal via toast notification
