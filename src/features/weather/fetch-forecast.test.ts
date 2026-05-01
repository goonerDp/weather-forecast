import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchForecast } from "./fetch-forecast";

const forecastFixture = {
  location: {
    name: "Lviv",
    region: "Lviv Oblast",
    country: "Ukraine",
    tz_id: "Europe/Kyiv",
  },
  current: {
    temp_c: 12.5,
    condition: {
      text: "Partly cloudy",
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
    },
    wind_kph: 8.6,
    wind_dir: "NW",
    feelslike_c: 11.2,
    humidity: 54,
    last_updated_epoch: 1776643200,
  },
  forecast: {
    forecastday: [
      {
        date: "2026-04-21",
        day: { mintemp_c: 7.1, maxtemp_c: 16.4 },
        astro: { sunrise: "05:52 AM", sunset: "08:07 PM" },
      },
    ],
  },
};

function mockFetchOk(body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.stubEnv("WEATHER_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchForecast", () => {
  it("throws when the API key is not configured", async () => {
    vi.stubEnv("WEATHER_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchForecast("Lviv")).rejects.toThrow(
      "API key not configured",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null on upstream 400 (unknown city)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 400 } as Response),
    );

    await expect(fetchForecast("???")).resolves.toBeNull();
  });

  it("throws on non-400 upstream error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response),
    );

    await expect(fetchForecast("Lviv")).rejects.toThrow(
      "Failed to fetch weather data",
    );
  });

  it("maps the raw response into WeatherData", async () => {
    const fetchMock = mockFetchOk(forecastFixture);

    await expect(fetchForecast("Lviv")).resolves.toEqual({
      city: "Lviv",
      region: "Lviv Oblast",
      country: "Ukraine",
      tempC: 12.5,
      condition: "Partly cloudy",
      conditionIcon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      minTempC: 7.1,
      maxTempC: 16.4,
      windKph: 8.6,
      windDir: "NW",
      feelsLikeC: 11.2,
      humidity: 54,
      sunrise: "05:52 AM",
      sunset: "08:07 PM",
      forecastDate: "2026-04-21",
      lastUpdatedEpochMs: 1776643200000,
    });

    const [calledUrl] = fetchMock.mock.calls[0];
    expect(calledUrl).toContain("key=test-key");
    expect(calledUrl).toContain("q=Lviv");
    expect(calledUrl).toContain("days=1");
  });

  it("encodes the city name in the query string", async () => {
    const fetchMock = mockFetchOk(forecastFixture);

    await fetchForecast("New York");

    const [calledUrl] = fetchMock.mock.calls[0];
    expect(calledUrl).toContain("q=New%20York");
  });
});
