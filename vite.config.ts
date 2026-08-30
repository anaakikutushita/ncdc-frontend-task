import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "jsdom", // DOM環境をシミュレート（UIテスト用）
    globals: true, // describe や it をインポートなしで使えるように設定
    setupFiles: ["./vitest.setup.ts"], // テストにおいてDOM専用のmatchersを使えるようにする
  },
});
