import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/weather", () => ({
  fetchForecast: vi.fn().mockResolvedValue(null),
}));

test("Page", async () => {
  const searchParams = Promise.resolve({});
  const jsx = await Page({ searchParams });
  render(jsx);
  expect(
    screen.getByRole("heading", { level: 1, name: "Weather Forecast" }),
  ).toBeDefined();
});
