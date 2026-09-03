import { z } from "zod";

export const CONTENT_ERR = {
  TITLE: {
    REQUIRED: "タイトルを入力してください",
    LONG: "タイトルは50文字以下にしてください",
  },
  BODY: {
    SHORT: "本文は10文字以上入力してください",
    LONG: "本文は2000文字以下にしてください",
  },
};

// ユーザーが新規作成するときのスキーマ
export const NewContentSchema = z.object({
  title: z.string().min(1, CONTENT_ERR.TITLE.REQUIRED).max(50, CONTENT_ERR.TITLE.LONG),
  body: z.string().min(10, CONTENT_ERR.BODY.SHORT).max(2000, CONTENT_ERR.BODY.LONG),
});

// 新規作成時のスキーマに加えて、DBで付与するフィールドを定義する
export const ContentSchema = NewContentSchema.extend({
  id: z.number(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Content = z.infer<typeof ContentSchema>;
