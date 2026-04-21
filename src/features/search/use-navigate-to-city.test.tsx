import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { useNavigateToCity } from "./use-navigate-to-city";
import { readHistory } from "./history-store";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = {
  name: "Lviv",
  region: "Lviv Oblast",
  country: "Ukraine",
};
const newYork: CitySearchResult = {
  name: "New York",
  region: "New York",
  country: "United States",
};

beforeEach(() => {
  window.localStorage.clear();
  pushMock.mockReset();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("useNavigateToCity", () => {
  it("pushes to /?city=<encoded name>, updates input, and records history", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useNavigateToCity(setInput));

    act(() => result.current(newYork));

    expect(pushMock).toHaveBeenCalledWith("/?city=New%20York");
    expect(setInput).toHaveBeenCalledWith("New York, New York, United States");
    expect(readHistory()).toEqual([newYork]);
  });

  it("prepends to existing history without duplicating", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useNavigateToCity(setInput));

    act(() => result.current(lviv));
    act(() => result.current(newYork));
    act(() => result.current(lviv));

    expect(readHistory()).toEqual([lviv, newYork]);
    expect(pushMock).toHaveBeenCalledTimes(3);
  });
});
