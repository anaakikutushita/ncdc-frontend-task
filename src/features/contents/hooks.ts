import useSWR from "swr";
import { z } from "zod";
import { fetcher } from "@/api/client";
import { ContentSchema, type Content } from "./schemas";

const EP_CONTENT = "/content";

// コンテンツ一覧の取得
export const useContents = () => {
  const { data, error, isLoading, mutate } = useSWR(EP_CONTENT, fetcher);

  const contents: Content[] | undefined = data ? z.array(ContentSchema).parse(data) : undefined;

  return { contents, error, isLoading, mutate };
};

// コンテンツの作成
export const createContent = async (title: string, body: string): Promise<Content> => {
  const responseData = await fetcher(EP_CONTENT, {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });

  return ContentSchema.parse(responseData);
};
