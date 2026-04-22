import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { WeatherData } from "./types";

const fetchForecastMock = vi.fn();

vi.mock("./fetch-forecast", () => ({
  fetchForecast: (city: string) => fetchForecastMock(city),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

import { WeatherSection } from "./weather-section";

const fixture: WeatherData = {
  city: "Lviv",
  region: "Lviv Oblast",
  country: "Ukraine",
  tempC: 12,
  condition: "Partly cloudy",
  conditionIcon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
  minTempC: 7,
  maxTempC: 16,
  windKph: 9,
  windDir: "NW",
  feelsLikeC: 11,
  humidity: 54,
  sunrise: "05:52 AM",
  sunset: "08:07 PM",
  forecastDate: "2026-04-21",
  lastUpdated: "2026-04-21 22:00",
  timezone: "Europe/Kyiv",
};

afterEach(() => {
  cleanup();
  fetchForecastMock.mockReset();
});

describe("WeatherSection", () => {
  it("renders the empty-state message when fetchForecast returns null", async () => {
    fetchForecastMock.mockResolvedValue(null);

    const jsx = await WeatherSection({ city: "Atlantis" });
    render(jsx);

    expect(fetchForecastMock).toHaveBeenCalledWith("Atlantis");
    expect(
      screen.getByText(/No results for .Atlantis.\. Try another city\./),
    ).toBeDefined();
  });

  it("renders the weather card when fetchForecast returns data", async () => {
    fetchForecastMock.mockResolvedValue(fixture);

    const jsx = await WeatherSection({ city: "Lviv" });
    render(jsx);

    expect(screen.getByText("Lviv")).toBeDefined();
    expect(screen.getByRole("img", { name: "Partly cloudy" })).toBeDefined();
    expect(screen.getByText("54%")).toBeDefined();
  });
});
