import * as hooks from "@/features/contents/hooks";
import { CONTENT_ERR } from "@/features/contents/schemas";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SectionTitle } from "./SectionTitle";

vi.mock("@/features/contents/hooks");

describe("SectionTitle コンポーネント", () => {
  const mockContent = {
    id: 1,
    title: "元のタイトル",
    body: "本文",
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("タイトルの編集ボタンをクリックすると、タイトル用のテキストボックスが表示される", async () => {
    const user = userEvent.setup();
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<SectionTitle content={mockContent} />);
    await user.click(screen.getByRole("button", { name: /タイトルを編集/i }));

    const titleInput = screen.getByRole("textbox", { name: /タイトル/i });
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("元のタイトル");
  });

  it("新しいタイトルを入力して保存すると、APIが呼ばれて閲覧モードに戻ること", async () => {
    const user = userEvent.setup();
    const mockUpdateContent = vi.spyOn(hooks, "updateContent").mockResolvedValue(undefined);
    const mockMutate = vi.fn();
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
    });

    render(<SectionTitle content={mockContent} />);

    // 編集モードに切り替え
    await user.click(screen.getByRole("button", { name: /タイトルを編集/i }));

    const input = screen.getByRole("textbox", { name: /タイトル/i });

    // 値を書き換える
    await user.clear(input);
    await user.type(input, "更新されたタイトル");

    // 保存ボタンをクリック
    await user.click(screen.getByRole("button", { name: /保存/i }));

    // 1. API呼び出しの検証（idと、更新対象のペイロード）
    expect(mockUpdateContent).toHaveBeenCalledWith(1, { title: "更新されたタイトル" });

    // 2. 保存完了後、入力欄が消えて閲覧モードに戻ることを検証
    expect(screen.queryByRole("textbox", { name: /タイトル/i })).not.toBeInTheDocument();
  });

  it("タイトルを空にして保存しようとするとZodのバリデーションエラーが表示され、APIは呼ばれないこと", async () => {
    const user = userEvent.setup();
    const mockUpdateContent = vi.spyOn(hooks, "updateContent");

    render(<SectionTitle content={mockContent} />);

    await user.click(screen.getByRole("button", { name: /タイトルを編集/i }));
    const input = screen.getByRole("textbox", { name: /タイトル/i });

    // タイトルを空にする
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /保存/i }));

    // APIが呼ばれていないことを検証
    expect(mockUpdateContent).not.toHaveBeenCalled();

    // エラーメッセージ（Zodスキーマで定義したもの）が表示されることを検証
    expect(screen.getByText(CONTENT_ERR.TITLE.REQUIRED)).toBeInTheDocument();
  });
});
