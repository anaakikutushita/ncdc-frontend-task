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
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/main.tsx",
        "src/**/schemas.ts", // 型定義・Zodスキーマのみのファイルを除外
        // 外部API依存のファイルは今回のテストスコープ外として除外
        "src/api/client.ts",
        "src/features/contents/hooks.ts",
      ],
    },
  },
});
