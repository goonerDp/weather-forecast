"use client";

import { useRouter } from "next/navigation";
import {
  CloseButton,
  Collection,
  ComboBox,
  EmptyState,
  Input,
  Label,
  ListBox,
} from "@heroui/react";
import { useCitySearch } from "./use-city-search";
import type { Key } from "react";

interface SearchComboboxProps {
  defaultValue?: string;
}

export function SearchCombobox({ defaultValue = "" }: SearchComboboxProps) {
  const router = useRouter();
  const { items, inputValue, onInputChange, clear } =
    useCitySearch(defaultValue);

  function handleSelectionChange(key: Key | null) {
    if (key === null) return;
    const city = items.find(
      (s) => `${s.name}-${s.region}-${s.country}` === key,
    );
    if (city) {
      router.push(`/?city=${encodeURIComponent(city.name)}`);
    }
  }

  return (
    <ComboBox
      allowsCustomValue
      allowsEmptyCollection
      aria-label="Search for a city"
      inputValue={inputValue}
      menuTrigger="input"
      onInputChange={onInputChange}
      onSelectionChange={handleSelectionChange}
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
        <ListBox renderEmptyState={() => <EmptyState />}>
          <Collection items={items}>
            {(city) => (
              <ListBox.Item
                id={`${city.name}-${city.region}-${city.country}`}
                textValue={`${city.name}, ${city.region}, ${city.country}`}
              >
                <Label>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-foreground/50">
                    , {city.region}, {city.country}
                  </span>
                </Label>
              </ListBox.Item>
            )}
          </Collection>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
