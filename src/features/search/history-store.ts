import type { CitySearchResult } from "./types";
import {
  MAX_HISTORY,
  addItem,
  insertItemAt,
  removeItem,
  removeItemWithUndo,
} from "./history-domain";

export const STORAGE_KEY = "weather-forecast:history";

export function parseHistory(
  raw: string | null | undefined,
): CitySearchResult[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry: unknown): entry is CitySearchResult =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "number" &&
        "name" in entry &&
        typeof entry.name === "string" &&
        "region" in entry &&
        typeof entry.region === "string" &&
        "country" in entry &&
        typeof entry.country === "string",
    );
  } catch (error) {
    console.error("Error parsing history JSON", error);
    return [];
  }
}

export function readHistory(): CitySearchResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return parseHistory(raw);
  } catch (error) {
    console.error("Error reading history from localStorage", error);

    return [];
  }
}

export function writeHistory(list: CitySearchResult[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Error writing history to localStorage", error);
  }
}

export function mutateHistory(
  mutate: (prev: CitySearchResult[]) => CitySearchResult[],
): CitySearchResult[] {
  const next = mutate(readHistory());

  writeHistory(next);

  return next;
}

export function addToHistory(
  city: CitySearchResult,
  max: number = MAX_HISTORY,
): CitySearchResult[] {
  return mutateHistory((prev) => addItem(prev, city, max));
}

export function removeFromHistory(key: string): CitySearchResult[] {
  return mutateHistory((prev) => removeItem(prev, key));
}

export function removeFromHistoryWithUndo(key: string): {
  removed: CitySearchResult | null;
  removedIndex: number;
} {
  let removed: CitySearchResult | null = null;
  let removedIndex = -1;

  mutateHistory((prev) => {
    const result = removeItemWithUndo(prev, key);
    removed = result.removed;
    removedIndex = result.removedIndex;
    return result.next;
  });

  return { removed, removedIndex };
}

export function restoreHistoryItem(
  item: CitySearchResult,
  index: number,
): CitySearchResult[] {
  return mutateHistory((prev) => insertItemAt(prev, item, index));
}
