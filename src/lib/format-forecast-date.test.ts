import { describe, it, expect } from "vitest";
import { formatForecastDate } from "./format-forecast-date";

describe("formatForecastDate", () => {
  it("formats a YYYY-MM-DD date with weekday, short month, and day", () => {
    const result = formatForecastDate("2026-04-21");

    expect(result).toContain("Tuesday");
    expect(result).toContain("Apr");
    expect(result).toContain("21");
  });

  it("handles single-digit month and day", () => {
    const result = formatForecastDate("2026-01-05");

    expect(result).toContain("Monday");
    expect(result).toContain("Jan");
    expect(result).toContain("5");
  });

  it("returns the raw input when the date cannot be parsed", () => {
    expect(formatForecastDate("not-a-date")).toBe("not-a-date");
  });

  it("returns the raw input when the string is empty", () => {
    expect(formatForecastDate("")).toBe("");
  });
});
