import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "node",
      setupFiles: ["./src/test/setup.ts"],
      fileParallelism: false,
      testTimeout: 15000,
      env,
    },
  };
});
