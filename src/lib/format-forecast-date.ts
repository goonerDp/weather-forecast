export function formatForecastDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
