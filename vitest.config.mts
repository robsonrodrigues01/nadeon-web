import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    // vários agentes rodam vitest ao mesmo tempo no Mac; 5 s padrão gera timeouts falsos
    testTimeout: 20000,
    environment: "node",
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
});
