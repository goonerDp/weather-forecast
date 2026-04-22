import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const { retryMock, resetMock } = vi.hoisted(() => ({
  retryMock: vi.fn(),
  resetMock: vi.fn(),
}));

vi.mock("next/error", () => ({
  unstable_catchError: (
    fallback: (props: object, info: object) => React.ReactNode,
  ) =>
    function StubBoundary(props: object) {
      return fallback(props, {
        error: new Error("boom"),
        unstable_retry: retryMock,
        reset: resetMock,
      }) as React.ReactElement;
    },
}));

import { WeatherErrorBoundary } from "./weather-error-boundary";

afterEach(() => {
  cleanup();
  retryMock.mockReset();
  resetMock.mockReset();
});

describe("WeatherErrorBoundary", () => {
  it("renders the fallback copy and a retry button", () => {
    render(
      <WeatherErrorBoundary>
        <div>child</div>
      </WeatherErrorBoundary>,
    );

    expect(screen.getByText("Couldn’t load weather")).toBeDefined();
    expect(
      screen.getByText("Check your connection and try again."),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Try again" })).toBeDefined();
  });

  it("calls unstable_retry when the retry button is pressed", () => {
    render(
      <WeatherErrorBoundary>
        <div />
      </WeatherErrorBoundary>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(retryMock).toHaveBeenCalledTimes(1);
  });
});
