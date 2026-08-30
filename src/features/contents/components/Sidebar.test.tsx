import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as hooks from "../hooks.ts";

vi.mock("../hooks.ts");

describe("Sidebar コンポーネント", () => {
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
