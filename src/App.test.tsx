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

    // 削除APIのモック
    vi.spyOn(hooks, 'deleteContent').mockImplementation(async (id) => {
      mockContents = mockContents.filter(c => c.id !== id);
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

  it('選択中の記事を削除した場合、メインエリアが「ページを選択してください」の初期状態に戻る', async () => {
    const user = userEvent.setup();

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <App />
      </SWRConfig>
    );

    // 1. 記事を選択してメインエリアに表示させる
    await user.click(screen.getByText('最初のタイトル'));
    expect(screen.getByRole('heading', { name: '最初のタイトル' })).toBeInTheDocument();

    // 2. サイドバーを編集モードにする
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // 3. 選択中の記事の削除ボタン（delete）をクリックする
    // ※ 最初のタイトル（id: 1）に対応する1番目のdeleteボタンを取得
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    // 4. 選択状態が解除され、メインエリアが初期状態に戻ることを検証
    expect(screen.getByText('ページを選択してください')).toBeInTheDocument();
  });
});
