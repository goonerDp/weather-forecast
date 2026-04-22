import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Combobox } from "./combobox";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = {
  id: 1,
  name: "Lviv",
  region: "",
  country: "Ukraine",
};
const london: CitySearchResult = {
  id: 3,
  name: "London",
  region: "City of London",
  country: "UK",
};

type Props = React.ComponentProps<typeof Combobox>;

function renderCombobox(overrides: Partial<Props> = {}) {
  const props: Props = {
    inputValue: "",
    items: [],
    loadingState: "idle",
    hasError: false,
    onInputChange: vi.fn(),
    onSelect: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  };
  return { ...render(<Combobox {...props} />), props };
}

function openPopover() {
  const input = screen.getByRole("combobox");
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  return input;
}

afterEach(() => {
  cleanup();
});

describe("Combobox", () => {
  it("does not render a clear button when input is empty", () => {
    renderCombobox({ inputValue: "" });
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("renders a clear button that fires onClear when input has value", () => {
    const onClear = vi.fn();
    renderCombobox({ inputValue: "Lv", onClear });

    const clear = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders the under-min-length empty state when the query is too short", () => {
    renderCombobox({ inputValue: "L" });
    openPopover();

    expect(
      screen.getByText(/Type at least 2 characters to search\./),
    ).toBeDefined();
  });

  it("renders the loading empty state while loading", () => {
    renderCombobox({ inputValue: "Lv", loadingState: "loading" });
    openPopover();

    expect(screen.getByText(/Searching/)).toBeDefined();
  });

  it("renders the error empty state when hasError is true", () => {
    renderCombobox({ inputValue: "Lv", hasError: true });
    openPopover();

    expect(
      screen.getByText(/Can.t load results\. Check your connection\./),
    ).toBeDefined();
  });

  it("renders the no-results empty state when query is long enough but items is empty", () => {
    renderCombobox({ inputValue: "Lviv" });
    openPopover();

    expect(screen.getByText(/No cities found for .Lviv.\./)).toBeDefined();
  });

  it("renders items and calls onSelect with the chosen city", () => {
    const onSelect = vi.fn();
    renderCombobox({
      inputValue: "L",
      items: [lviv, london],
      onSelect,
    });
    openPopover();

    const option = screen.getByRole("option", { name: /London/ });
    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith(london);
  });
});
