import { useCallback, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import type { CitySearchResult } from "./types";

export const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export type LoadingState = "idle" | "loading" | "filtering";

async function fetchCities(url: string): Promise<CitySearchResult[]> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch cities");
  }

  return res.json();
}

export function useCitySearch(defaultValue: string) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [debouncedQuery] = useDebounce(inputValue, DEBOUNCE_MS);

  const trimmedRaw = inputValue.trim();
  const trimmedDebounced = debouncedQuery.trim();

  const shouldFetch =
    trimmedRaw.length >= MIN_QUERY_LENGTH &&
    trimmedDebounced.length >= MIN_QUERY_LENGTH;

  const key = shouldFetch
    ? `/api/search?q=${encodeURIComponent(trimmedDebounced)}`
    : null;

  const { data, error, isLoading, isValidating } = useSWR<CitySearchResult[]>(
    key,
    fetchCities,
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const items = shouldFetch ? (data ?? []) : [];
  const isDebouncing = trimmedRaw !== trimmedDebounced;
  const loadingState: LoadingState = isLoading
    ? "loading"
    : isDebouncing || isValidating
      ? "filtering"
      : "idle";
  const hasError = shouldFetch && Boolean(error);

  const clear = useCallback(() => setInputValue(""), []);

  return {
    items,
    inputValue,
    loadingState,
    hasError,
    onInputChange: setInputValue,
    clear,
    setValue: setInputValue,
  };
}
