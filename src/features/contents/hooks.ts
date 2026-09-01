import { fetcher } from "@/api/client";
import useSWR from "swr";
import { z } from "zod";
import { ContentSchema, type Content } from "./schemas";

const EP_CONTENT = "/content";

// コンテンツ一覧の取得
export const useContents = () => {
  const { data, error, isLoading, mutate } = useSWR(EP_CONTENT, fetcher);

  const contents: Content[] | undefined = data ? z.array(ContentSchema).parse(data) : undefined;

  return { contents, error, isLoading, mutate };
};

// 単一のコンテンツの取得
export const useContent = (id: number | null) => {
  const { data, error, isLoading, mutate } = useSWR(id ? `${EP_CONTENT}/${id}` : null, fetcher);

  const content: Content | undefined = data ? ContentSchema.parse(data) : undefined;

  return { content, error, isLoading, mutate };
};

// コンテンツの作成
export const createContent = async (title: string, body: string): Promise<Content> => {
  const responseData = await fetcher(EP_CONTENT, {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });

  return ContentSchema.parse(responseData);
};

// コンテンツの更新
export const updateContent = async (
  id: number,
  { title, body }: Partial<Content>,
): Promise<Content> => {
  const responseData = await fetcher(`${EP_CONTENT}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, body }),
  });

  return ContentSchema.parse(responseData);
};

// コンテンツの削除
export const deleteContent = async (id: number): Promise<void> => {
  await fetcher(`${EP_CONTENT}/${id}`, {
    method: "DELETE",
  });

  // レスポンスは204 No Contentなので、特に何も返さない
  return undefined;
};
