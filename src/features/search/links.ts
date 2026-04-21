export function getCityHref(name: string): string {
  return `/?city=${encodeURIComponent(name)}`;
}
