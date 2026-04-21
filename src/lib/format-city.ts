import type { CitySearchResult } from "@/types";

export function formatCity(city: Partial<CitySearchResult>): string {
  return [city.name, city.region, city.country]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");
}
