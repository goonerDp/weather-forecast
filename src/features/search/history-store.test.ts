import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  MAX_HISTORY,
  STORAGE_KEY,
  addItem,
  getCityKey,
  readHistory,
  removeFromHistoryWithUndo,
  removeItem,
  undoLastRemoval,
  writeHistory,
} from "./history-store";
import type { CitySearchResult } from "@/types";

const lviv: CitySearchResult = { name: "Lviv", region: "", country: "Ukraine" };
const kyiv: CitySearchResult = { name: "Kyiv", region: "", country: "Ukraine" };
const london: CitySearchResult = {
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
      name: "London",
      region: "Ontario",
      country: "Canada",
    };
    expect(addItem([london], londonOnt)).toEqual([londonOnt, london]);
  });

  it("caps the list at max items, evicting the oldest", () => {
    const seed = Array.from({ length: MAX_HISTORY }, (_, i) => ({
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
  });

  it("round-trips a list", () => {
    writeHistory([lviv, kyiv]);
    expect(readHistory()).toEqual([lviv, kyiv]);
  });

  it("returns [] when nothing is stored", () => {
    expect(readHistory()).toEqual([]);
  });

  it("returns [] when stored value is not valid JSON", () => {
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

describe("undo last removal (store)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it("restores the last removed item when undo is called", () => {
    writeHistory([lviv, kyiv]);
    const { removed } = removeFromHistoryWithUndo(getCityKey(kyiv));
    expect(removed).toEqual(kyiv);
    expect(readHistory()).toEqual([lviv]);

    const restored = undoLastRemoval();
    expect(restored).toEqual([lviv, kyiv]);
    expect(readHistory()).toEqual([lviv, kyiv]);
  });

  it("is a no-op when there is nothing to undo", () => {
    writeHistory([lviv]);
    expect(undoLastRemoval()).toBeNull();
    expect(readHistory()).toEqual([lviv]);
  });

  it("only keeps the most recent removal undo state", () => {
    writeHistory([lviv, kyiv, london]);

    removeFromHistoryWithUndo(getCityKey(kyiv));
    expect(readHistory()).toEqual([lviv, london]);

    removeFromHistoryWithUndo(getCityKey(lviv));
    expect(readHistory()).toEqual([london]);

    const restored = undoLastRemoval();
    expect(restored).toEqual([lviv, london]);
    expect(readHistory()).toEqual([lviv, london]);
  });
});
