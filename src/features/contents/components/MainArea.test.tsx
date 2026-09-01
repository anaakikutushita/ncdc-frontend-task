import * as hooks from "@/features/contents/hooks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MainArea } from "./MainArea.tsx";

vi.mock("@/features/contents/hooks");

describe("MainArea コンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // デフォルトの戻り値を設定し、destructure時のエラーを防ぐ
  vi.spyOn(hooks, "useContent").mockReturnValue({
    content: undefined,
    isLoading: false,
    error: undefined,
    mutate: vi.fn(),
  });

  const mockContent = {
    id: 1,
    title: "選択されたタイトル",
    body: "選択された本文の長文データ...",
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };

  it("selectedIdがnullの場合は「ページを選択してください」と表示される", () => {
    render(<MainArea selectedId={null} />);
    expect(screen.getByText("ページを選択してください")).toBeInTheDocument();
  });

  it("デフォルトでは閲覧モードとしてプレーンテキストで表示される", () => {
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<MainArea selectedId={1} />);

    // 見出しやテキストとして存在することを検証
    expect(screen.getByRole("heading", { name: "選択されたタイトル" })).toBeInTheDocument();
    expect(screen.getByText(/選択された本文/)).toBeInTheDocument();

    // 入力フォームが存在しないことを検証
    expect(screen.queryByRole("textbox", { name: /タイトル/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /本文/i })).not.toBeInTheDocument();
  });

  it("タイトルの編集ボタンをクリックすると、タイトル用のテキストボックスが表示される", async () => {
    const user = userEvent.setup();
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<MainArea selectedId={1} />);
    await user.click(screen.getByRole("button", { name: /タイトルを編集/i }));

    const titleInput = screen.getByRole("textbox", { name: /タイトル/i });
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("選択されたタイトル");
  });

  it("本文の編集ボタンをクリックすると、本文用のテキストボックス（textarea）が表示される", async () => {
    const user = userEvent.setup();
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<MainArea selectedId={1} />);
    await user.click(screen.getByRole("button", { name: /本文を編集/i }));

    const bodyInput = screen.getByRole("textbox", { name: /本文/i });
    expect(bodyInput).toBeInTheDocument();
    expect(bodyInput).toHaveValue(mockContent.body);
  });
});
