import { describe, it, expect } from "vitest";
import { formatLocation } from "./format-location";

describe("formatLocation", () => {
  it("joins city, region, and country", () => {
    expect(
      formatLocation({ city: "Lviv", region: "Lviv Oblast", country: "Ukraine" }),
    ).toBe("Lviv, Lviv Oblast, Ukraine");
  });

  it("omits empty region", () => {
    expect(
      formatLocation({ city: "Lviv", region: "", country: "Ukraine" }),
    ).toBe("Lviv, Ukraine");
  });

  it("omits undefined values", () => {
    expect(
      formatLocation({ city: "Lviv", region: undefined, country: "Ukraine" }),
    ).toBe("Lviv, Ukraine");
  });

  it("omits null and whitespace-only values", () => {
    expect(
      formatLocation({ city: "Lviv", region: "   ", country: null }),
    ).toBe("Lviv");
  });

  it("returns empty string when all values are missing", () => {
    expect(formatLocation({})).toBe("");
  });

  it("trims surrounding whitespace in kept values", () => {
    expect(
      formatLocation({ city: " Lviv ", region: null, country: " Ukraine" }),
    ).toBe("Lviv, Ukraine");
  });
});
