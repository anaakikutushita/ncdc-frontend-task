import { describe, it, expect } from 'vitest';
import { sortContentsByDesc } from './sort';
import { type Content } from '@/features/contents/schemas';

describe('sortContentsByDesc', () => {
  // テスト用のダミーページを作成
  const generateContent = (id: number, createdAt: string): Content => ({
    id,
    title: `タイトル ${id}`,
    body: `本文 ${id}`,
    createdAt,
    updatedAt: createdAt,
  });

  it('作成日時の降順（最新が上）にソートされること', () => {
    const input = [
      generateContent(1, '2026-08-29T00:00:00.000Z'),
      generateContent(2, '2026-08-31T00:00:00.000Z'),
      generateContent(3, '2026-08-30T00:00:00.000Z'),
    ];

    const result = sortContentsByDesc(input);

    expect(result[0].id).toBe(2); // 8/31
    expect(result[1].id).toBe(3); // 8/30
    expect(result[2].id).toBe(1); // 8/29
  });

  it('引数として渡した元の配列を変更しないこと', () => {
    const input = [
      generateContent(1, '2026-08-29T00:00:00.000Z'),
      generateContent(2, '2026-08-30T00:00:00.000Z'),
    ];
    // 元の配列のコピーを保存
    const originalInput = [...input];

    sortContentsByDesc(input);

    // 実行後も、元の配列が変更されていないことを確認
    expect(input).toEqual(originalInput);
  });

  it('空配列の場合、要素が1つの場合はそのまま返ること', () => {
    expect(sortContentsByDesc([])).toEqual([]);

    const singleItem = [generateContent(1, '2026-08-30T00:00:00.000Z')];
    expect(sortContentsByDesc(singleItem)).toEqual(singleItem);
  });

  it('createdAtが未定義（空文字）の場合でもクラッシュせず処理されること', () => {
    const input = [
      generateContent(1, ''),
      generateContent(2, '2026-08-30T00:00:00.000Z'),
    ];

    const result = sortContentsByDesc(input);
    expect(result[0].id).toBe(2); // 有効な日付が上にくること
    expect(result[1].id).toBe(1);
  });
});
