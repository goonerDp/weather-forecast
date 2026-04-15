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
  toast,
} from "@heroui/react";
import { MIN_QUERY_LENGTH, useCitySearch } from "./use-city-search";
import { useSearchHistory } from "./use-search-history";
import { getCityKey } from "./history-store";
import { formatLocation } from "@/features/weather/format-location";
import type { CitySearchResult } from "@/types";
import type { Key } from "react";

interface SearchComboboxProps {
  defaultValue?: string;
}

export function SearchCombobox({ defaultValue = "" }: SearchComboboxProps) {
  const router = useRouter();
  const { items, inputValue, loadingState, onInputChange, clear } =
    useCitySearch(defaultValue);
  const {
    history,
    add: addHistory,
    removeWithUndo,
    undoRemove,
  } = useSearchHistory();

  const query = inputValue.trim();
  const shouldShowHistory = query.length === 0 && history.length > 0;
  const displayItems: CitySearchResult[] = shouldShowHistory ? history : items;

  const navigateToCity = (city: CitySearchResult) => {
    addHistory(city);
    router.push(`/?city=${encodeURIComponent(city.name)}`);
  };

  const handleChange = (key: Key | null) => {
    if (key === null) {
      return;
    }

    const city = displayItems.find((cityItem) => getCityKey(cityItem) === key);

    if (city) {
      navigateToCity(city);
    }
  };

  const handleRemoveFromHistory = (city: CitySearchResult) => {
    const key = getCityKey(city);
    const { removed } = removeWithUndo(key);

    if (!removed) {
      return;
    }

    const toastId = toast(
      <div>Removed {removed.name} from recent search</div>,
      {
        description: "Undo to add it back",
        timeout: 500000,
        actionProps: {
          children: "Undo",
          variant: "tertiary",
          onPress: () => {
            const restored = undoRemove();

            if (restored) {
              toast.close(toastId);
            }
          },
        },
      },
    );
  };

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
      menuTrigger="focus"
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
        {shouldShowHistory && (
          <div className="px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-foreground/50">
            Recent search
          </div>
        )}
        <ListBox renderEmptyState={renderEmptyState}>
          <Collection items={displayItems}>
            {(city) => {
              const location = formatLocation({
                region: city.region,
                country: city.country,
              });
              return (
                <ListBox.Item
                  id={getCityKey(city)}
                  textValue={formatLocation({
                    city: city.name,
                    region: city.region,
                    country: city.country,
                  })}
                  className="flex items-center justify-between gap-2"
                >
                  <Label className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{city.name}</span>
                    {location && (
                      <span className="text-foreground/50">, {location}</span>
                    )}
                  </Label>
                  {shouldShowHistory && (
                    <CloseButton
                      className="size-5 shrink-0 [&_svg]:size-3"
                      aria-label={`Remove ${city.name} from history`}
                      slot={null}
                      preventFocusOnPress
                      onPress={() => {
                        handleRemoveFromHistory(city);
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onPointerUp={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  )}
                </ListBox.Item>
              );
            }}
          </Collection>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
