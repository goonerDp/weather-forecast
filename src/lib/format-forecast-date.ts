export function formatForecastDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
