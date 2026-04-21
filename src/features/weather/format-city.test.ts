import { describe, it, expect } from "vitest";
import { formatCity } from "./format-city";

describe("formatCity", () => {
  it("joins name, region, and country", () => {
    expect(
      formatCity({
        name: "Lviv",
        region: "Lviv Oblast",
        country: "Ukraine",
      }),
    ).toBe("Lviv, Lviv Oblast, Ukraine");
  });

  it("omits empty region", () => {
    expect(formatCity({ name: "Lviv", region: "", country: "Ukraine" })).toBe(
      "Lviv, Ukraine",
    );
  });

  it("omits undefined values", () => {
    expect(
      formatCity({ name: "Lviv", region: undefined, country: "Ukraine" }),
    ).toBe("Lviv, Ukraine");
  });

  it("omits whitespace-only values", () => {
    expect(formatCity({ name: "Lviv", region: "   " })).toBe("Lviv");
  });

  it("returns empty string when all values are missing", () => {
    expect(formatCity({})).toBe("");
  });

  it("trims surrounding whitespace in kept values", () => {
    expect(formatCity({ name: " Lviv ", country: " Ukraine" })).toBe(
      "Lviv, Ukraine",
    );
  });

  it("supports partial input (no name)", () => {
    expect(formatCity({ region: "Lviv Oblast", country: "Ukraine" })).toBe(
      "Lviv Oblast, Ukraine",
    );
  });
});
