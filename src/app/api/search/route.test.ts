import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function makeRequest(query: string): NextRequest {
  return new NextRequest(`http://localhost/api/search${query}`);
}

function mockFetchOk(body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.stubEnv("WEATHER_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GET /api/search", () => {
  it("returns [] without calling upstream when q is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(makeRequest(""));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns [] without calling upstream when q is whitespace", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(makeRequest("?q=%20%20"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when the API key is not configured", async () => {
    vi.stubEnv("WEATHER_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(makeRequest("?q=Lv"));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "API key not configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the upstream fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network down")),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await GET(makeRequest("?q=Lv"));

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      error: "Upstream search service unreachable",
    });
  });

  it("passes through upstream status when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429 } as Response),
    );

    const res = await GET(makeRequest("?q=Lv"));

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({
      error: "Failed to fetch search results",
    });
  });

  it("maps upstream results to { name, region, country } and sets cache headers", async () => {
    const fetchMock = mockFetchOk([
      {
        name: "Lviv",
        region: "Lviv Oblast",
        country: "Ukraine",
        id: 1,
        lat: 49.83,
        lon: 24.02,
      },
      { name: "London", region: "City of London", country: "UK", id: 2 },
    ]);

    const res = await GET(makeRequest("?q=New%20York"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { id: 1, name: "Lviv", region: "Lviv Oblast", country: "Ukraine" },
      { id: 2, name: "London", region: "City of London", country: "UK" },
    ]);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );

    const [calledUrl] = fetchMock.mock.calls[0];
    expect(calledUrl).toContain("key=test-key");
    expect(calledUrl).toContain("q=New%20York");
  });
});
