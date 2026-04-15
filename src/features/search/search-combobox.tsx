"use client";

import { useRouter } from "next/navigation";
import {
  CloseButton,
  Collection,
  ComboBox,
  Input,
  Label,
  ListBox,
  Spinner,
} from "@heroui/react";
import { MIN_QUERY_LENGTH, useCitySearch } from "./use-city-search";
import { formatLocation } from "@/features/weather/format-location";
import type { Key } from "react";

interface SearchComboboxProps {
  defaultValue?: string;
}

export function SearchCombobox({ defaultValue = "" }: SearchComboboxProps) {
  const router = useRouter();
  const { items, inputValue, loadingState, onInputChange, clear } =
    useCitySearch(defaultValue);

  function handleChange(key: Key | null) {
    if (key === null) return;
    const city = items.find(
      (s) => `${s.name}-${s.region}-${s.country}` === key,
    );
    if (city) {
      router.push(`/?city=${encodeURIComponent(city.name)}`);
    }
  }

  function renderEmptyState() {
    const query = inputValue.trim();
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
  }

  return (
    <ComboBox
      allowsCustomValue
      allowsEmptyCollection
      aria-label="Search for a city"
      inputValue={inputValue}
      menuTrigger="input"
      onInputChange={onInputChange}
      onChange={handleChange}
    >
      <ComboBox.InputGroup>
        <Input placeholder="Search for a city..." className="pr-8" />
        {inputValue && (
          <CloseButton
            className="absolute right-2 size-5 [&_svg]:size-3"
            aria-label="Clear search"
            onPress={() => {
              clear();
              router.push("/");
            }}
          />
        )}
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox renderEmptyState={renderEmptyState}>
          <Collection items={items}>
            {(city) => {
              const rest = formatLocation({
                region: city.region,
                country: city.country,
              });
              return (
                <ListBox.Item
                  id={`${city.name}-${city.region}-${city.country}`}
                  textValue={formatLocation({
                    city: city.name,
                    region: city.region,
                    country: city.country,
                  })}
                >
                  <Label>
                    <span className="font-medium">{city.name}</span>
                    {rest && (
                      <span className="text-foreground/50">, {rest}</span>
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
