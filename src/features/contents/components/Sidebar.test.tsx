import * as hooks from "@/features/contents/hooks";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
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
});

describe('Sidebar コンポーネント 編集モード', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(hooks, 'useContents').mockReturnValue({
      contents: [
        { id: 1, title: 'mock-コンテンツ1', body: 'mock-コンテンツ1の本文', createdAt: '2026-08-30T00:00:00.000Z', updatedAt: '2026-08-30T00:00:00.000Z' },
      ],
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
    });
  });

  it('EditとDoneのクリックでUIの表示状態が切り替わる', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const expectDefaultState = () => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /new page/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /done/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    };

    // 1. デフォルト状態の検証
    expectDefaultState();

    // Editボタンをクリック
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // 2. Edit状態の検証
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    // Doneボタンをクリック
    await user.click(screen.getByRole('button', { name: /done/i }));

    // 3. 再びデフォルト状態に戻ることを検証
    expectDefaultState();
  });
});
