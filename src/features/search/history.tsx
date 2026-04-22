"use client";

import { Key, Label, Selection, Tag, TagGroup, toast } from "@heroui/react";
import { getCityKey } from "./history-domain";
import { useSearchHistory } from "./use-search-history";
import { formatCity } from "@/lib/format-city";
import { RemovedToast } from "./removed-toast";
import type { CitySearchResult } from "./types";

const UNDO_TIMEOUT_MS = 5000;

interface HistoryProps {
  onSelect: (city: CitySearchResult) => void;
}

function firstKey(keys: Selection): Key | undefined {
  if (keys === "all") {
    return undefined;
  }
  return keys.values().next().value;
}

export function History({ onSelect }: HistoryProps) {
  const { history, removeWithUndo } = useSearchHistory();

  if (history.length === 0) {
    return null;
  }

  const handleSelect = (keys: Selection) => {
    const key = firstKey(keys);

    if (key === undefined) {
      return;
    }

    const city = history.find((cityItem) => getCityKey(cityItem) === key);

    if (city) {
      onSelect(city);
    }
  };

  const handleRemove = (keys: Set<Key>) => {
    const key = firstKey(keys);

    if (typeof key !== "string") {
      return;
    }

    const { removed, undo } = removeWithUndo(key);

    if (!removed || !undo) {
      return;
    }

    const toastId = toast(<RemovedToast city={removed} />, {
      timeout: UNDO_TIMEOUT_MS,
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

  return (
    <TagGroup
      selectionMode="single"
      selectedKeys={new Set<Key>()}
      onSelectionChange={handleSelect}
      onRemove={handleRemove}
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
  );
}
