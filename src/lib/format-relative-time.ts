const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(thenMs: number, nowMs: number): string {
  const diffMs = thenMs - nowMs;
  const absMs = Math.abs(diffMs);
  const fmt = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  if (absMs < MINUTE) {
    return "now";
  }
  if (absMs < HOUR) {
    return fmt.format(Math.round(diffMs / MINUTE), "minute");
  }
  if (absMs < DAY) {
    return fmt.format(Math.round(diffMs / HOUR), "hour");
  }
  return fmt.format(Math.round(diffMs / DAY), "day");
}
