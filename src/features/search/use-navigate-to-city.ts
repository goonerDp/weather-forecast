"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatCity } from "@/lib/format-city";
import type { CitySearchResult } from "@/types";
import { getCityHref } from "./links";
import { useSearchHistory } from "./use-search-history";

export function useNavigateToCity(setInputValue: (value: string) => void) {
  const router = useRouter();
  const { add: addHistory } = useSearchHistory();

  return useCallback(
    (city: CitySearchResult) => {
      addHistory(city);
      setInputValue(formatCity(city));
      router.push(getCityHref(city.name));
    },
    [router, addHistory, setInputValue],
  );
}
