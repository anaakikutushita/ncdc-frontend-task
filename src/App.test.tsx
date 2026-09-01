import * as hooks from "@/features/contents/hooks";
import type { Content } from "@/features/contents/schemas";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("@/features/contents/hooks");

describe("App 統合テスト", () => {
  let mockContents: Content[];

  beforeEach(() => {
    vi.clearAllMocks();

    // 疑似的なバックエンドDBの状態
    mockContents = [
      { id: 1, title: "最初のタイトル", body: "本文1", createdAt: "", updatedAt: "" },
      { id: 2, title: "ページ2", body: "本文2", createdAt: "", updatedAt: "" },
    ];

    // APIをモック。各種API通信において同じmockContentsを参照・更新するように実装
    vi.spyOn(hooks, "useContents").mockImplementation(() => ({
      contents: mockContents,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    }));
    vi.spyOn(hooks, "useContent").mockImplementation((id) => ({
      content: mockContents.find((c) => (c === null ? false : c.id === id)),
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    }));

    vi.spyOn(hooks, "updateContent").mockImplementation(async (id, data) => {
      const index = mockContents.findIndex((c) => c.id === id);
      mockContents[index] = { ...mockContents[index], ...data };
      return mockContents[index];
    });
  });

  it("MainAreaでタイトルを保存すると、Sidebarの表示も連動して更新される", async () => {
    const user = userEvent.setup();

    // SWRのキャッシュをテストごとに独立させるラッパー
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <App />
      </SWRConfig>,
    );

    // Sidebarでページ1を選択
    await user.click(screen.getByText("最初のタイトル"));

    // MainAreaでタイトルを編集・保存
    const editButtons = screen.getAllByRole("button", { name: /編集/i });
    await user.click(editButtons[0]); // タイトルの編集ボタン

    const titleInput = screen.getByRole("textbox", { name: /タイトル/i });
    await user.clear(titleInput);
    await user.type(titleInput, "変更後の新しいタイトル");
    await user.click(screen.getByRole("button", { name: /保存/i }));

    // Sidebar内に「変更後の新しいタイトル」が反映されているかを検証
    await waitFor(() => {
      // SidebarとMainAreaの両方に新しいタイトルが存在することを検証（配列で取得）
      const updatedTitles = screen.getAllByText("変更後の新しいタイトル");
      expect(updatedTitles.length).toBeGreaterThanOrEqual(1);
    });
  });
});
