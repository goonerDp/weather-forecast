import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SWRConfig } from "swr";
import type { PropsWithChildren } from "react";
import { DEBOUNCE_MS, useCitySearch } from "./use-city-search";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = {
  id: 1,
  name: "Lviv",
  region: "",
  country: "Ukraine",
};

function wrapper({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
}

async function flushDebounce() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
  });
}

function mockFetchOk(body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("useCitySearch", () => {
  it("does not fetch when query is below min length", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("L"));
    await flushDebounce();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([]);
  });

  it("fetches after debounce and returns items", async () => {
    const fetchMock = mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("Lv"));
    expect(fetchMock).not.toHaveBeenCalled();

    await flushDebounce();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/search?q=Lv");
    expect(result.current.items).toEqual([lviv]);
  });

  it("reuses cache when the same query is repeated", async () => {
    const fetchMock = mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("Lv"));
    await flushDebounce();
    expect(result.current.items).toEqual([lviv]);

    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);

    act(() => result.current.setInputValue("Lv"));
    await flushDebounce();
    expect(result.current.items).toEqual([lviv]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("exposes hasError when the fetch rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("offline"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("Lv"));
    await flushDebounce();

    expect(result.current.hasError).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it("exposes hasError when the response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 500 } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("Lv"));
    await flushDebounce();

    expect(result.current.hasError).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it("clear resets input and items immediately", async () => {
    mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.setInputValue("Lv"));
    await flushDebounce();
    expect(result.current.items).toEqual([lviv]);

    act(() => result.current.clear());
    expect(result.current.inputValue).toBe("");
    expect(result.current.items).toEqual([]);
  });
});
