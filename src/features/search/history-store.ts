import type { CitySearchResult } from "@/types";
import {
  MAX_HISTORY,
  addItem,
  removeItem,
  removeItemWithUndo,
} from "./history-domain";

export const STORAGE_KEY = "weather-forecast:history";
export { MAX_HISTORY, addItem } from "./history-domain";
export { getCityKey } from "./history-domain";
export { removeItem } from "./history-domain";

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

type UndoState = {
  snapshot: CitySearchResult[];
  removedKey: string;
} | null;

let lastRemoval: UndoState = null;

export function removeFromHistoryWithUndo(key: string): {
  next: CitySearchResult[];
  removed: CitySearchResult | null;
} {
  let removed: CitySearchResult | null = null;

  const next = mutateHistory((prev) => {
    const result = removeItemWithUndo(prev, key);
    removed = result.removed;

    if (result.removed) {
      lastRemoval = { snapshot: result.undoSnapshot, removedKey: key };
    }

    return result.next;
  });

  return { next, removed };
}

export function undoLastRemoval(): CitySearchResult[] | null {
  if (!lastRemoval) {
    return null;
  }

  const snapshot = lastRemoval.snapshot;
  lastRemoval = null;
  writeHistory(snapshot);

  return snapshot;
}
