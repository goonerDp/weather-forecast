import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { Toast } from "@heroui/react";
import { History } from "./history";
import { writeHistory } from "./history-store";
import type { CitySearchResult } from "./types";

const lviv: CitySearchResult = {
  id: 1,
  name: "Lviv",
  region: "Lviv Oblast",
  country: "Ukraine",
};
const kyiv: CitySearchResult = {
  id: 2,
  name: "Kyiv",
  region: "",
  country: "Ukraine",
};

function renderHistory(onSelect = vi.fn()) {
  return {
    onSelect,
    ...render(
      <>
        <Toast.Provider placement="bottom" />
        <History onSelect={onSelect} />
      </>,
    ),
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("History", () => {
  it("renders nothing when there is no stored history", () => {
    const { container } = renderHistory();

    expect(container.querySelector("[data-slot='tag-group']")).toBeNull();
    expect(screen.queryByText("Recent searches")).toBeNull();
  });

  it("renders a tag for each stored city with a remove button", () => {
    writeHistory([lviv, kyiv]);
    renderHistory();

    expect(screen.getByText("Recent searches")).toBeDefined();
    expect(screen.getByText("Lviv, Lviv Oblast, Ukraine")).toBeDefined();
    expect(screen.getByText("Kyiv, Ukraine")).toBeDefined();
  });

  it("calls onSelect with the clicked city", () => {
    writeHistory([lviv, kyiv]);
    const { onSelect } = renderHistory();

    const tag = screen.getByRole("row", { name: /Kyiv/ });
    fireEvent.click(within(tag).getByRole("gridcell", { name: /Kyiv/ }));

    expect(onSelect).toHaveBeenCalledWith(kyiv);
  });

  it("removing a tag queues an undo toast that restores the tag when pressed", () => {
    writeHistory([lviv, kyiv]);
    renderHistory();

    const tag = screen.getByRole("row", { name: /Kyiv/ });
    fireEvent.click(within(tag).getByRole("button", { name: /Remove/i }));

    expect(screen.queryByRole("row", { name: /Kyiv/ })).toBeNull();

    const undoButton = screen.getByRole("button", { name: "Undo" });
    fireEvent.click(undoButton);

    expect(screen.getByRole("row", { name: /Kyiv/ })).toBeDefined();
  });
});
