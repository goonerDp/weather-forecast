import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SWRConfig } from "swr";
import type { PropsWithChildren } from "react";
import { useCitySearch } from "./use-city-search";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = { name: "Lviv", region: "", country: "Ukraine" };

function wrapper({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
}

const waitForDebounce = () => new Promise((r) => setTimeout(r, 350));

function mockFetchOk(body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("useCitySearch", () => {
  it("does not fetch when query is below min length", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.onInputChange("L"));
    await waitForDebounce();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([]);
  });

  it("fetches after debounce and returns items", async () => {
    const fetchMock = mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.onInputChange("Lv"));
    expect(fetchMock).not.toHaveBeenCalled();

    await waitFor(() => expect(result.current.items).toEqual([lviv]));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/search?q=Lv");
  });

  it("reuses cache when the same query is repeated", async () => {
    const fetchMock = mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.onInputChange("Lv"));
    await waitFor(() => expect(result.current.items).toEqual([lviv]));

    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);

    act(() => result.current.onInputChange("Lv"));
    await waitFor(() => expect(result.current.items).toEqual([lviv]));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clear resets input and items immediately", async () => {
    mockFetchOk([lviv]);

    const { result } = renderHook(() => useCitySearch(""), { wrapper });
    act(() => result.current.onInputChange("Lv"));
    await waitFor(() => expect(result.current.items).toEqual([lviv]));

    act(() => result.current.clear());
    expect(result.current.inputValue).toBe("");
    expect(result.current.items).toEqual([]);
  });
});
