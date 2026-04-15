import type { CitySearchResult } from "@/types";

export const MAX_HISTORY = 10;

export function getCityKey(city: CitySearchResult): string {
  return `${city.name}-${city.region}-${city.country}`;
}

export function addItem(
  list: CitySearchResult[],
  item: CitySearchResult,
  max: number = MAX_HISTORY,
): CitySearchResult[] {
  const key = getCityKey(item);
  const without = list.filter((entry) => getCityKey(entry) !== key);

  return [item, ...without].slice(0, max);
}

export function removeItem(list: CitySearchResult[], key: string): CitySearchResult[] {
  return list.filter((entry) => getCityKey(entry) !== key);
}

