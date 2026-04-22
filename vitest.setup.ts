// jsdom does not expose the CSS namespace that react-aria relies on for
// building querySelector strings. Polyfill the one method it uses.
if (typeof globalThis.CSS === "undefined") {
  (
    globalThis as unknown as { CSS: { escape: (value: string) => string } }
  ).CSS = {
    escape: (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&"),
  };
}

// jsdom does not implement matchMedia, which HeroUI reads at mount time.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom does not implement ResizeObserver, which HeroUI's toast measurement uses.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (
    globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }
  ).ResizeObserver = ResizeObserverStub;
}
