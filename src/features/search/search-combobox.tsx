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
import { useAsyncList } from "@react-stately/data";
import type { SearchComboboxResult } from "@/types";
import type { Key } from "react";

interface SearchComboboxProps {
  defaultValue?: string;
}

export function SearchCombobox({ defaultValue = "" }: SearchComboboxProps) {
  const router = useRouter();

  const list = useAsyncList<SearchComboboxResult>({
    initialFilterText: defaultValue,
    async load({ filterText, signal }) {
      if (!filterText || filterText.trim().length < 2) {
        return { items: [] };
      }

      const res = await fetch(
        `/api/search?q=${encodeURIComponent(filterText)}`,
        { signal },
      );

      if (!res.ok) return { items: [] };

      const data: SearchComboboxResult[] = await res.json();
      return { items: data };
    },
  });

  function handleSelectionChange(key: Key | null) {
    if (key === null) return;
    const city = list.items.find(
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
      inputValue={list.filterText}
      menuTrigger="input"
      onInputChange={list.setFilterText}
      onSelectionChange={handleSelectionChange}
    >
      <ComboBox.InputGroup>
        <Input placeholder="Search for a city..." className="pr-8" />
        {list.filterText && (
          <CloseButton
            className="absolute right-2 size-5 [&_svg]:size-3"
            aria-label="Clear search"
            onPress={() => {
              list.setFilterText("");
              router.push("/");
            }}
          />
        )}
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox renderEmptyState={() => <EmptyState />}>
          <Collection items={list.items}>
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
