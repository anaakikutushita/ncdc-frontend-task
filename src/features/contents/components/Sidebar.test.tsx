import * as hooks from "@/features/contents/hooks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

vi.mock("@/features/contents/hooks");

describe("Sidebar コンポーネント 初期状態", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("コンテンツ一覧の表示", () => {
    // API通信をモック
    vi.spyOn(hooks, "useContents").mockReturnValue({
      contents: [
        {
          id: 1,
          title: "mock-コンテンツ1",
          body: "mock-コンテンツ1の本文",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
        {
          id: 2,
          title: "mock-コンテンツ2",
          body: "mock-コンテンツ2の本文",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
      ],
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<Sidebar />);

    expect(screen.getByText("mock-コンテンツ1")).toBeInTheDocument();
    expect(screen.getByText("mock-コンテンツ2")).toBeInTheDocument();
  });

  it("一覧が作成日時の降順（最新が上）にソートされること", () => {
    vi.spyOn(hooks, "useContents").mockReturnValue({
      contents: [
        {
          id: 1,
          title: "古いページ",
          body: "本文1",
          createdAt: "2026-08-29T00:00:00.000Z",
          updatedAt: "2026-08-29T00:00:00.000Z",
        },
        {
          id: 2,
          title: "新しいページ",
          body: "本文2",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
      ],
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });

    render(<Sidebar />);

    // li要素をすべて取得し、画面上の表示順を検証
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("新しいページ");
    expect(listItems[1]).toHaveTextContent("古いページ");
  });

  // TODO: 空表示のテストを追加する

  // TODO: エラー表示のテストを追加する
});

describe("Sidebar コンポーネント 編集モード", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(hooks, "useContents").mockReturnValue({
      contents: [
        {
          id: 1,
          title: "mock-コンテンツ1",
          body: "mock-コンテンツ1の本文",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
      ],
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });
  });

  it("EditとDoneのクリックでUIの表示状態が切り替わる", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const expectDefaultState = () => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /new page/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /done/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    };

    // 1. デフォルト状態の検証
    expectDefaultState();

    // Editボタンをクリック
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // 2. Edit状態の検証
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /done/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();

    // Doneボタンをクリック
    await user.click(screen.getByRole("button", { name: /done/i }));

    // 3. 再びデフォルト状態に戻ることを検証
    expectDefaultState();
  });

  it("新規ページの作成、およびリスト先頭への追加", async () => {
    const user = userEvent.setup();
    const mockMutate = vi.fn();
    const initialContents = [
      {
        id: 1,
        title: "既存ページ",
        body: "本文1",
        createdAt: "2026-08-30T00:00:00.000Z",
        updatedAt: "2026-08-30T00:00:00.000Z",
      },
    ];

    vi.spyOn(hooks, "useContents").mockReturnValue({
      contents: initialContents,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
    });

    // createContentのAPI呼び出しをモック化
    const mockCreateContent = vi.spyOn(hooks, "createContent").mockResolvedValue({
      id: 2,
      title: "新しいページ",
      body: "新しいページの本文を入力",
      createdAt: "2026-08-30T00:00:00.000Z",
      updatedAt: "2026-08-30T00:00:00.000Z",
    });

    render(<Sidebar />);

    // 編集モードにして New page をクリック
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /new page/i }));

    // 1. API関数が正しい初期値で呼ばれたかを検証
    expect(mockCreateContent).toHaveBeenCalledWith("新しいページ", "新しいページの本文を入力");

    // 2. SWRのキャッシュ更新関数（mutate）が呼ばれたかを検証
    expect(mockMutate).toHaveBeenCalled();

    // 3. mutate に渡されたコールバック関数を抽出し、配列の「先頭」にデータが追加されるロジックか検証
    const mutateCallback = mockMutate.mock.calls[0][0];
    const updatedContents = mutateCallback(initialContents);

    expect(updatedContents).toHaveLength(2);
    expect(updatedContents[0].id).toBe(2); // 先頭（一番上）が新規データであること
    expect(updatedContents[1].id).toBe(1); // 2番目が既存データであること
  });

  it("deleteボタンでページ削除、SWRキャッシュからも除外", async () => {
    const user = userEvent.setup();
    const mockMutate = vi.fn();

    const initialContents = [
      {
        id: 1,
        title: "削除対象のページ",
        body: "本文1",
        createdAt: "2026-08-30T00:00:00.000Z",
        updatedAt: "2026-08-30T00:00:00.000Z",
      },
    ];

    vi.spyOn(hooks, "useContents").mockReturnValue({
      contents: initialContents,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
    });

    const mockDeleteContent = vi.spyOn(hooks, "deleteContent").mockResolvedValue(undefined);

    render(<Sidebar />);

    // 編集モードに切り替え、単一のdeleteボタンをクリック
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // 1. 削除APIが、対象となる id: 1 を引数として正しく呼ばれたかを検証
    expect(mockDeleteContent).toHaveBeenCalledWith(1);
    expect(mockMutate).toHaveBeenCalled();

    // 2. mutate に渡されたコールバック関数が、対象ID（1）を除外するロジックか検証
    const mutateCallback = mockMutate.mock.calls[0][0];
    const updatedContents = mutateCallback(initialContents);

    expect(updatedContents).toHaveLength(0); // 1件だった配列が空になること
  });
});
