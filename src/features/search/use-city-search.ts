import { useState } from "react";
import { useAsyncList } from "@react-stately/data";
import { useDebouncedCallback } from "use-debounce";
import type { CitySearchResult } from "@/types";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function useCitySearch(defaultValue: string) {
  const [inputValue, setInputValue] = useState(defaultValue);

  const list = useAsyncList<CitySearchResult>({
    initialFilterText: defaultValue,
    async load({ filterText, signal }) {
      if (!filterText || filterText.trim().length < MIN_QUERY_LENGTH) {
        return { items: [] };
      }

      const res = await fetch(
        `/api/search?q=${encodeURIComponent(filterText)}`,
        { signal },
      );

      if (!res.ok) return { items: [] };

      const data: CitySearchResult[] = await res.json();
      return { items: data };
    },
  });

  const debouncedSearch = useDebouncedCallback(list.setFilterText, DEBOUNCE_MS);

  function handleInputChange(value: string) {
    setInputValue(value);
    debouncedSearch(value);
  }

  function clear() {
    setInputValue("");
    debouncedSearch.cancel();
    list.setFilterText("");
  }

  function setValue(value: string) {
    setInputValue(value);
    debouncedSearch.cancel();
    list.setFilterText(value);
  }

  return {
    items: list.items,
    inputValue,
    loadingState: list.loadingState,
    filterText: list.filterText,
    onInputChange: handleInputChange,
    clear,
    setValue,
  };
}

export { MIN_QUERY_LENGTH };
