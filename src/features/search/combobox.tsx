"use client";

import {
  CloseButton,
  Collection,
  ComboBox,
  Input,
  Key,
  Label,
  ListBox,
  Spinner,
} from "@heroui/react";
import { MIN_QUERY_LENGTH, useCitySearch } from "./use-city-search";
import { getCityKey } from "./history-domain";
import { formatCity } from "@/lib/format-city";
import type { CitySearchResult } from "./types";

type LoadingState = ReturnType<typeof useCitySearch>["loadingState"];

interface ComboboxProps {
  inputValue: string;
  items: CitySearchResult[];
  loadingState: LoadingState;
  onInputChange: (value: string) => void;
  onSelect: (city: CitySearchResult) => void;
  onClear: () => void;
}

export function Combobox({
  inputValue,
  items,
  loadingState,
  onInputChange,
  onSelect,
  onClear,
}: ComboboxProps) {
  const handleChange = (key: Key | null) => {
    if (key === null) {
      return;
    }

    const city = items.find((cityItem) => getCityKey(cityItem) === key);

    if (city) {
      onSelect(city);
    }
  };

  const query = inputValue.trim();

  const renderEmptyState = () => {
    if (loadingState === "loading" || loadingState === "filtering") {
      return (
        <div className="flex items-center justify-center gap-2 p-4 text-sm text-foreground/60">
          <Spinner className="size-4" /> Searching&hellip;
        </div>
      );
    }
    if (query.length < MIN_QUERY_LENGTH) {
      return (
        <div className="p-4 text-center text-sm text-foreground/60">
          Type at least {MIN_QUERY_LENGTH} characters to search.
        </div>
      );
    }
    return (
      <div className="p-4 text-center text-sm text-foreground/60">
        No cities found for &ldquo;{query}&rdquo;.
      </div>
    );
  };

  return (
    <ComboBox
      allowsCustomValue
      allowsEmptyCollection
      aria-label="Search for a city"
      inputValue={inputValue}
      onInputChange={onInputChange}
      onChange={handleChange}
    >
      <ComboBox.InputGroup>
        <Input placeholder="Search for a city..." className="pr-8" />
        {inputValue && (
          <CloseButton
            className="absolute right-2 size-5 [&_svg]:size-3"
            aria-label="Clear search"
            onPress={onClear}
          />
        )}
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox renderEmptyState={renderEmptyState}>
          <Collection items={items}>
            {(city) => {
              const location = formatCity({
                region: city.region,
                country: city.country,
              });

              return (
                <ListBox.Item
                  id={getCityKey(city)}
                  textValue={formatCity(city)}
                >
                  <Label className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{city.name}</span>
                    {location && (
                      <span className="text-foreground/50">, {location}</span>
                    )}
                  </Label>
                </ListBox.Item>
              );
            }}
          </Collection>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
