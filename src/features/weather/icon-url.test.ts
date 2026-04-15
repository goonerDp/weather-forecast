import { describe, it, expect } from "vitest";
import { getWeatherIconUrl } from "./icon-url";

describe("getWeatherIconUrl", () => {
  it("upgrades 64x64 to 128x128", () => {
    expect(
      getWeatherIconUrl("//cdn.weatherapi.com/weather/64x64/day/116.png"),
    ).toBe("https://cdn.weatherapi.com/weather/128x128/day/116.png");
  });

  it("prefixes protocol-relative URLs with https:", () => {
    expect(getWeatherIconUrl("//example.com/icon.png")).toBe(
      "https://example.com/icon.png",
    );
  });

  it("leaves absolute URLs unchanged apart from size swap", () => {
    expect(
      getWeatherIconUrl(
        "https://cdn.weatherapi.com/weather/64x64/night/113.png",
      ),
    ).toBe("https://cdn.weatherapi.com/weather/128x128/night/113.png");
  });

  it("returns the input when no 64x64 segment is present", () => {
    expect(getWeatherIconUrl("https://example.com/icon.png")).toBe(
      "https://example.com/icon.png",
    );
  });
});
