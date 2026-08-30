import { describe, expect, it } from "vitest";
import { CONTENT_ERR, NewContentSchema } from "@/features/contents/schemas";

describe("NewContentSchema バリデーション", () => {
  // 基準となる正常データ
  const validData = {
    title: "あ", // 1文字
    body: "あ".repeat(10), // 10文字
  };

  it("正常系: 境界値の条件を満たす場合は通過すること", () => {
    expect(() => NewContentSchema.parse(validData)).not.toThrow();
  });

  const INVALID_PATTERNS = [
    {
      label: "タイトルが0文字",
      overrides: { title: "" },
      expectedError: CONTENT_ERR.TITLE.REQUIRED,
    },
    {
      label: "タイトルが51文字",
      overrides: { title: "あ".repeat(51) },
      expectedError: CONTENT_ERR.TITLE.LONG,
    },
    {
      label: "本文が9文字",
      overrides: { body: "あ".repeat(9) },
      expectedError: CONTENT_ERR.BODY.SHORT,
    },
    {
      label: "本文が2001文字",
      overrides: { body: "あ".repeat(2001) },
      expectedError: CONTENT_ERR.BODY.LONG,
    },
  ] as const;

  it.each(INVALID_PATTERNS)("異常系: $label の場合はエラー", ({overrides, expectedError}) => {
    const invalidData = { ...validData, ...overrides };
    const result = NewContentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(expectedError);
    }
  });
});
