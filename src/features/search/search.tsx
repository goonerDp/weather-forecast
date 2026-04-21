"use client";

import { useRouter } from "next/navigation";
import { Combobox } from "./combobox";
import { History } from "./history";
import { useCitySearch } from "./use-city-search";
import { useNavigateToCity } from "./use-navigate-to-city";

interface SearchProps {
  defaultValue?: string;
}

export function Search({ defaultValue = "" }: SearchProps) {
  const router = useRouter();
  const {
    items,
    inputValue,
    loadingState,
    hasError,
    onInputChange,
    clear,
    setValue,
  } = useCitySearch(defaultValue);
  const navigateToCity = useNavigateToCity(setValue);

  const handleClear = () => {
    clear();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-3">
      <Combobox
        inputValue={inputValue}
        items={items}
        loadingState={loadingState}
        hasError={hasError}
        onInputChange={onInputChange}
        onSelect={navigateToCity}
        onClear={handleClear}
      />
      <History onSelect={navigateToCity} />
    </div>
  );
}
