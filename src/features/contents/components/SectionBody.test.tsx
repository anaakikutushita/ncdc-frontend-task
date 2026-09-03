import * as hooks from "@/features/contents/hooks";
import { CONTENT_ERR } from "@/features/contents/schemas";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SectionBody } from "./SectionBody";

vi.mock("@/features/contents/hooks");

describe("SectionBody コンポーネント", () => {
  const mockContent = {
    id: 1,
    title: "タイトル",
    body: "元の本文",
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("本文の編集ボタンをクリックすると、textareaが表示される", async () => {
    const user = userEvent.setup();
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<SectionBody content={mockContent} />);
    await user.click(screen.getByRole("button", { name: /本文を編集/i }));

    const textarea = screen.getByRole("textbox", { name: /本文/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("元の本文");
  });

  it("新しい本文を入力して保存すると、APIが呼ばれて閲覧モードに戻る", async () => {
    const user = userEvent.setup();
    const mockUpdateContent = vi.spyOn(hooks, "updateContent").mockResolvedValue(mockContent);
    vi.spyOn(hooks, "useContent").mockReturnValue({
      content: mockContent,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<SectionBody content={mockContent} />);

    await user.click(screen.getByRole("button", { name: /本文を編集/i }));
    const textarea = screen.getByRole("textbox", { name: /本文/i });

    await user.clear(textarea);
    await user.type(textarea, "更新された本文データ");
    await user.click(screen.getByRole("button", { name: /保存/i }));

    expect(mockUpdateContent).toHaveBeenCalledWith(1, { body: "更新された本文データ" });
    expect(screen.queryByRole("textbox", { name: /本文/i })).not.toBeInTheDocument();
  });

  it("本文を空にして保存しようとするとZodのバリデーションエラーが表示され、APIは呼ばれない", async () => {
    const user = userEvent.setup();
    const mockUpdateContent = vi.spyOn(hooks, "updateContent");

    render(<SectionBody content={mockContent} />);

    await user.click(screen.getByRole("button", { name: /本文を編集/i }));
    const textarea = screen.getByRole("textbox", { name: /本文/i });

    await user.clear(textarea);
    await user.click(screen.getByRole("button", { name: /保存/i }));

    expect(mockUpdateContent).not.toHaveBeenCalled();
    // 転職活動2026 のスキーマで定義したエラーメッセージを想定
    expect(screen.getByText(CONTENT_ERR.BODY.SHORT)).toBeInTheDocument();
  });

  it("編集をキャンセルすると、入力内容とエラー状態がリセットされて閲覧モードに戻ること", async () => {
    const user = userEvent.setup();
    const mockUpdateContent = vi.spyOn(hooks, "updateContent");

    render(<SectionBody content={mockContent} />);

    // 1. 編集モードにして、空文字（エラー状態）にする
    await user.click(screen.getByRole("button", { name: /本文を編集/i }));
    const textarea = screen.getByRole("textbox", { name: /本文/i });
    await user.clear(textarea);
    await user.click(screen.getByRole("button", { name: /保存/i }));

    // エラーメッセージが出ていることを確認
    expect(screen.getByText(CONTENT_ERR.BODY.SHORT)).toBeInTheDocument();

    // 2. さらに別の文字を入力してからキャンセルする
    await user.type(textarea, "破棄されるべきテキスト");
    await user.click(screen.getByRole("button", { name: /キャンセル/i }));

    // 3. 閲覧モードに戻り、APIは呼ばれていないことを検証
    expect(screen.queryByRole("textbox", { name: /本文/i })).not.toBeInTheDocument();
    expect(mockUpdateContent).not.toHaveBeenCalled();

    // 4. 再度編集モードにした際、入力内容とエラーがリセットされていることを検証
    await user.click(screen.getByRole("button", { name: /本文を編集/i }));
    const reopenedInput = screen.getByRole("textbox", { name: /本文/i });

    expect(reopenedInput).toHaveValue("元の本文"); // 破棄テキストが残っていないこと
    expect(screen.queryByText(CONTENT_ERR.BODY.SHORT)).not.toBeInTheDocument(); // エラーが消えていること
  });
});
