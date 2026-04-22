import type { CitySearchResult } from "@/features/search";

export function formatCity(city: Partial<CitySearchResult>): string {
  return [city.name, city.region, city.country]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");
}
