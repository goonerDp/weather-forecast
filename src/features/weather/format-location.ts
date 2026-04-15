export function formatLocation(parts: {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}): string {
  return [parts.city, parts.region, parts.country]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");
}
