import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  readHistory,
  removeFromHistoryWithUndo,
  restoreHistoryItem,
  writeHistory,
} from "./history-store";
import { MAX_HISTORY, addItem, getCityKey, removeItem } from "./history-domain";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = {
  id: 1,
  name: "Lviv",
  region: "",
  country: "Ukraine",
};
const kyiv: CitySearchResult = {
  id: 2,
  name: "Kyiv",
  region: "",
  country: "Ukraine",
};
const london: CitySearchResult = {
  id: 3,
  name: "London",
  region: "City of London",
  country: "UK",
};

describe("addItem", () => {
  it("prepends a new item", () => {
    expect(addItem([kyiv], lviv)).toEqual([lviv, kyiv]);
  });

  it("deduplicates by key and moves match to the top", () => {
    expect(addItem([kyiv, lviv], lviv)).toEqual([lviv, kyiv]);
  });

  it("treats same name in different countries as distinct", () => {
    const londonOnt: CitySearchResult = {
      id: 4,
      name: "London",
      region: "Ontario",
      country: "Canada",
    };
    expect(addItem([london], londonOnt)).toEqual([londonOnt, london]);
  });

  it("caps the list at max items, evicting the oldest", () => {
    const seed = Array.from({ length: MAX_HISTORY }, (_, i) => ({
      id: 100 + i,
      name: `City${i}`,
      region: "",
      country: "X",
    }));
    const result = addItem(seed, lviv);
    expect(result).toHaveLength(MAX_HISTORY);
    expect(result[0]).toEqual(lviv);
    expect(result.at(-1)).toEqual(seed[MAX_HISTORY - 2]);
  });
});

describe("removeItem", () => {
  it("removes by key", () => {
    expect(removeItem([lviv, kyiv], getCityKey(kyiv))).toEqual([lviv]);
  });

  it("is a no-op when key is not present", () => {
    expect(removeItem([lviv], "nope")).toEqual([lviv]);
  });
});

describe("readHistory / writeHistory", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("round-trips a list", () => {
    writeHistory([lviv, kyiv]);
    expect(readHistory()).toEqual([lviv, kyiv]);
  });

  it("returns [] when nothing is stored", () => {
    expect(readHistory()).toEqual([]);
  });

  it("returns [] when stored value is not valid JSON", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem(STORAGE_KEY, "not-json");
    expect(readHistory()).toEqual([]);
  });

  it("filters out malformed entries", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([lviv, { name: "Bad" }, null]),
    );
    expect(readHistory()).toEqual([lviv]);
  });
});

describe("undo removal (store)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it("reinserts a removed item at its original index", () => {
    writeHistory([lviv, kyiv]);
    const { removed, removedIndex } = removeFromHistoryWithUndo(
      getCityKey(kyiv),
    );
    expect(removed).toEqual(kyiv);
    expect(removedIndex).toBe(1);
    expect(readHistory()).toEqual([lviv]);

    const restored = restoreHistoryItem(removed!, removedIndex);
    expect(restored).toEqual([lviv, kyiv]);
    expect(readHistory()).toEqual([lviv, kyiv]);
  });

  it("reports no removal when the key is not present", () => {
    writeHistory([lviv]);
    const { removed, removedIndex } = removeFromHistoryWithUndo("nope");
    expect(removed).toBeNull();
    expect(removedIndex).toBe(-1);
  });

  it("supports undoing multiple removals independently", () => {
    writeHistory([lviv, kyiv, london]);

    const kyivRemoval = removeFromHistoryWithUndo(getCityKey(kyiv));
    const lvivRemoval = removeFromHistoryWithUndo(getCityKey(lviv));
    expect(readHistory()).toEqual([london]);

    restoreHistoryItem(lvivRemoval.removed!, lvivRemoval.removedIndex);
    restoreHistoryItem(kyivRemoval.removed!, kyivRemoval.removedIndex);
    expect(readHistory()).toEqual([lviv, kyiv, london]);
  });

  it("is a no-op when the item is already present", () => {
    writeHistory([lviv, kyiv]);
    const restored = restoreHistoryItem(lviv, 0);
    expect(restored).toEqual([lviv, kyiv]);
  });
});
