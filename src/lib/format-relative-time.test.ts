import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-relative-time";

const NOW = Date.parse("2026-05-01T12:00:00Z");

describe("formatRelativeTime", () => {
  it("returns 'now' when within a minute", () => {
    expect(formatRelativeTime(NOW - 5_000, NOW)).toBe("now");
  });

  it("formats minutes in the past", () => {
    expect(formatRelativeTime(NOW - 5 * 60_000, NOW)).toBe("5 minutes ago");
  });

  it("formats hours in the past", () => {
    expect(formatRelativeTime(NOW - 3 * 60 * 60_000, NOW)).toBe("3 hours ago");
  });

  it("formats days in the past", () => {
    expect(formatRelativeTime(NOW - 2 * 24 * 60 * 60_000, NOW)).toBe(
      "2 days ago",
    );
  });

  it("uses 'yesterday' for one day ago", () => {
    expect(formatRelativeTime(NOW - 24 * 60 * 60_000, NOW)).toBe("yesterday");
  });

  it("formats minutes in the future", () => {
    expect(formatRelativeTime(NOW + 10 * 60_000, NOW)).toBe("in 10 minutes");
  });
});
