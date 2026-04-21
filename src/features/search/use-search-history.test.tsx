import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSearchHistory } from "./use-search-history";
import { STORAGE_KEY, writeHistory } from "./history-store";
import { getCityKey } from "./history-domain";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = { name: "Lviv", region: "", country: "Ukraine" };
const kyiv: CitySearchResult = { name: "Kyiv", region: "", country: "Ukraine" };
const london: CitySearchResult = {
  name: "London",
  region: "City of London",
  country: "UK",
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("useSearchHistory", () => {
  it("exposes the current history from localStorage", () => {
    writeHistory([lviv, kyiv]);

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual([lviv, kyiv]);
  });

  it("add prepends a new city and triggers a re-render", () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);

    act(() => result.current.add(lviv));

    expect(result.current.history).toEqual([lviv]);
  });

  it("remove drops the city by key", () => {
    writeHistory([lviv, kyiv]);
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.remove(getCityKey(lviv)));

    expect(result.current.history).toEqual([kyiv]);
  });

  it("removeWithUndo returns an undo that restores the item at its original index", () => {
    writeHistory([lviv, kyiv, london]);
    const { result } = renderHook(() => useSearchHistory());

    let undo: (() => void) | null = null;
    act(() => {
      const res = result.current.removeWithUndo(getCityKey(kyiv));
      expect(res.removed).toEqual(kyiv);
      undo = res.undo;
    });

    expect(result.current.history).toEqual([lviv, london]);
    expect(undo).not.toBeNull();

    act(() => undo!());
    expect(result.current.history).toEqual([lviv, kyiv, london]);
  });

  it("removeWithUndo returns a null undo when the key is not present", () => {
    writeHistory([lviv]);
    const { result } = renderHook(() => useSearchHistory());

    let undo: (() => void) | null = null;
    act(() => {
      const res = result.current.removeWithUndo("does-not-exist");
      undo = res.undo;
    });

    expect(undo).toBeNull();
    expect(result.current.history).toEqual([lviv]);
  });

  it("re-renders on cross-tab storage events for the history key", () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);

    act(() => {
      writeHistory([lviv]);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: window.localStorage.getItem(STORAGE_KEY),
        }),
      );
    });

    expect(result.current.history).toEqual([lviv]);
  });

  it("ignores storage events for unrelated keys", () => {
    writeHistory([lviv]);
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([lviv]);

    act(() => {
      window.localStorage.setItem("some-other-key", "x");
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "some-other-key",
          newValue: "x",
        }),
      );
    });

    expect(result.current.history).toEqual([lviv]);
  });
});
