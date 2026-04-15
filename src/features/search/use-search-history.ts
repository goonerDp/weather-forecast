"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CitySearchResult } from "@/types";
import {
  STORAGE_KEY,
  addToHistory,
  parseHistory,
  removeFromHistory,
  removeFromHistoryWithUndo,
  undoLastRemoval,
} from "./history-store";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

let cachedSnapshot: CitySearchResult[] = [];
let cacheKey = "";

function getSnapshot(): CitySearchResult[] {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";

  if (raw !== cacheKey) {
    cacheKey = raw;
    cachedSnapshot = parseHistory(raw);
  }

  return cachedSnapshot;
}

const EMPTY_HISTORY: CitySearchResult[] = [];

function getServerSnapshot(): CitySearchResult[] {
  return EMPTY_HISTORY;
}

export function useSearchHistory() {
  const history = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const add = useCallback((city: CitySearchResult) => {
    addToHistory(city);
    notify();
  }, []);

  const remove = useCallback((key: string) => {
    removeFromHistory(key);
    notify();
  }, []);

  const removeWithUndo = useCallback((key: string) => {
    const result = removeFromHistoryWithUndo(key);
    notify();
    return result;
  }, []);

  const undoRemove = useCallback(() => {
    const result = undoLastRemoval();
    if (result) notify();
    return result;
  }, []);

  return { history, add, remove, removeWithUndo, undoRemove };
}
