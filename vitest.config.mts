import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    alias: {
      "server-only": new URL("./vitest.server-only.ts", import.meta.url)
        .pathname,
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
