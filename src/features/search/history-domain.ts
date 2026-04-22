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
): CitySearchResult[] {
  return list.filter((entry) => getCityKey(entry) !== key);
}

export function removeItemWithUndo(
  list: CitySearchResult[],
  key: string,
): {
  next: CitySearchResult[];
  removed: CitySearchResult | null;
  removedIndex: number;
} {
  const idx = list.findIndex((entry) => getCityKey(entry) === key);

  if (idx === -1) {
    return { next: list, removed: null, removedIndex: -1 };
  }

  const removed = list[idx] ?? null;
  const next = list.filter((entry) => getCityKey(entry) !== key);

  return { next, removed, removedIndex: idx };
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
