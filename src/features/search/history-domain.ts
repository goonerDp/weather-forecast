import type { CitySearchResult } from "./types";

export const MAX_HISTORY = 5;

export function getCityKey(city: CitySearchResult): string {
  return String(city.id);
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

export function removeItem(
  list: CitySearchResult[],
  key: string,
): {
  list: CitySearchResult[];
  removed: CitySearchResult | null;
  removedIndex: number;
} {
  const idx = list.findIndex((entry) => getCityKey(entry) === key);

  if (idx === -1) {
    return { list, removed: null, removedIndex: -1 };
  }

  const next = [...list.slice(0, idx), ...list.slice(idx + 1)];

  return { list: next, removed: list[idx], removedIndex: idx };
}

export function insertItemAt(
  list: CitySearchResult[],
  item: CitySearchResult,
  index: number,
): CitySearchResult[] {
  const key = getCityKey(item);

  if (list.some((entry) => getCityKey(entry) === key)) {
    return list;
  }

  const clamped = Math.min(Math.max(index, 0), list.length);

  return [...list.slice(0, clamped), item, ...list.slice(clamped)];
}
