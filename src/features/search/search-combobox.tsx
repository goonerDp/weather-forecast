"use client";

import { useRouter } from "next/navigation";
import {
  CloseButton,
  Collection,
  ComboBox,
  Input,
  Key,
  Label,
  ListBox,
  Selection,
  Spinner,
  Tag,
  TagGroup,
  toast,
} from "@heroui/react";
import { MIN_QUERY_LENGTH, useCitySearch } from "./use-city-search";
import { useSearchHistory } from "./use-search-history";
import { getCityKey } from "./history-domain";
import { getCityHref } from "./links";
import { RemovedToast } from "./removed-toast";
import { formatCity } from "@/features/weather/format-city";
import type { CitySearchResult } from "@/types";
import { TOAST_UNDO_TIMEOUT } from "./consts";

interface SearchComboboxProps {
  defaultValue?: string;
}

export function SearchCombobox({ defaultValue = "" }: SearchComboboxProps) {
  const router = useRouter();
  const { items, inputValue, loadingState, onInputChange, clear, setValue } =
    useCitySearch(defaultValue);
  const { history, add: addHistory, removeWithUndo } = useSearchHistory();

  const navigateToCity = (city: CitySearchResult) => {
    addHistory(city);
    setValue(formatCity(city));
    router.push(getCityHref(city.name));
  };

  const handleChange = (key: Key | null) => {
    if (key === null) {
      return;
    }

    const city = items.find((cityItem) => getCityKey(cityItem) === key);

    if (city) {
      navigateToCity(city);
    }
  };

  const firstKey = (keys: Selection): Key | undefined => {
    if (keys === "all") {
      return undefined;
    }
    return keys.values().next().value;
  };

  const handleHistorySelect = (keys: Selection) => {
    const key = firstKey(keys);

    if (key === undefined) {
      return;
    }

    const city = history.find((cityItem) => getCityKey(cityItem) === key);

    if (city) {
      navigateToCity(city);
    }
  };

  const handleHistoryRemove = (keys: Set<Key>) => {
    const key = firstKey(keys);

    if (typeof key !== "string") {
      return;
    }

    const { removed, undo } = removeWithUndo(key);

    if (!removed || !undo) {
      return;
    }

    const toastId = toast(<RemovedToast city={removed} />, {
      timeout: TOAST_UNDO_TIMEOUT,
      actionProps: {
        children: "Undo",
        variant: "tertiary",
        onPress: () => {
          undo();
          toast.close(toastId);
        },
      },
    });
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
    <div className="flex flex-col gap-3">
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
      {history.length > 0 && (
        <TagGroup
          selectionMode="single"
          selectedKeys={new Set<Key>()}
          onSelectionChange={handleHistorySelect}
          onRemove={handleHistoryRemove}
        >
          <Label className="text-sm font-medium tracking-wide text-foreground/60">
            Recent searches
          </Label>
          <TagGroup.List items={history} className="mt-1">
            {(city) => {
              const fullName = formatCity(city);
              return (
                <Tag id={getCityKey(city)} textValue={fullName}>
                  {fullName}
                  <Tag.RemoveButton />
                </Tag>
              );
            }}
          </TagGroup.List>
        </TagGroup>
      )}
    </div>
  );
}
