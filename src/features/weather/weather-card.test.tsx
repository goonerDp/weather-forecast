import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { WeatherCard } from "./weather-card";
import type { WeatherData } from "./types";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

afterEach(() => {
  cleanup();
});

const baseData: WeatherData = {
  city: "Lviv",
  region: "Lviv Oblast",
  country: "Ukraine",
  tempC: 12.6,
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
  lastUpdated: "2026-04-21 22:00",
  timezone: "Europe/Kyiv",
};

describe("WeatherCard", () => {
  it("renders the weather icon with the condition as alt text and the https 128x128 URL", () => {
    render(<WeatherCard data={baseData} />);

    const icon = screen.getByRole("img", { name: "Partly cloudy" });
    expect(icon.getAttribute("src")).toBe(
      "https://cdn.weatherapi.com/weather/128x128/day/116.png",
    );
  });

  it("renders city, region, and country", () => {
    render(<WeatherCard data={baseData} />);

    expect(screen.getByText("Lviv")).toBeDefined();
    expect(screen.getByText("Lviv Oblast, Ukraine")).toBeDefined();
  });

  it("omits the region separator when region is empty", () => {
    render(<WeatherCard data={{ ...baseData, region: "" }} />);

    expect(screen.getByText("Ukraine")).toBeDefined();
    expect(screen.queryByText(/Lviv Oblast/)).toBeNull();
  });

  it("rounds temperature, description, and H/L/Feels-like line", () => {
    const { container } = render(<WeatherCard data={baseData} />);

    expect(screen.getByText("13°")).toBeDefined();
    expect(screen.getByText("Partly cloudy")).toBeDefined();

    const normalized = container.textContent?.replace(/\s+/g, " ") ?? "";
    expect(normalized).toContain("H: 16° · L: 7° · Feels like 11°");
  });

  it("renders wind, humidity, sunrise, sunset, and last-updated stats", () => {
    render(<WeatherCard data={baseData} />);

    expect(screen.getByText("Wind")).toBeDefined();
    expect(screen.getByText("9 kph NW")).toBeDefined();
    expect(screen.getByText("Humidity")).toBeDefined();
    expect(screen.getByText("54%")).toBeDefined();
    expect(screen.getByText("Sunrise")).toBeDefined();
    expect(screen.getByText("05:52 AM")).toBeDefined();
    expect(screen.getByText("Sunset")).toBeDefined();
    expect(screen.getByText("08:07 PM")).toBeDefined();
    expect(
      screen.getByText(/Updated 2026-04-21 22:00.*Europe\/Kyiv/),
    ).toBeDefined();
  });
});
