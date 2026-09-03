import { useContent } from "@/features/contents/hooks";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { SectionBody } from "./SectionBody.tsx";
import { SectionTitle } from "./SectionTitle.tsx";

const MainContainer = ({ children, className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge("h-full px-10 pt-[30px] grid grid-rows-[1fr_auto] grid-cols-1", className)}
      {...props}
    >
      <main className="rounded-2xl p-[30px] bg-surface-light overflow-hidden">{children}</main>
      <footer className="h-16 text-sm flex justify-between items-center">
        <p>Copyright © 2021 Sample</p>
        <p>運営会社</p>
      </footer>
    </div>
  );
};

type MainAreaProps = {
  selectedId: number | null;
};

export const MainArea = ({ selectedId, className }: MainAreaProps & ComponentProps<"div">) => {
  // 万が一 undefined が返ってきた場合のエラーを防ぐため {} でフォールバック
  const { content, isLoading, error } = useContent(selectedId) || {};

  return (
    <MainContainer className={className}>
      {!selectedId && <MainContainer className={className}>ページを選択してください</MainContainer>}
      {isLoading && <MainContainer className={className}>読み込み中...</MainContainer>}
      {error && <MainContainer className={className}>エラーが発生しました</MainContainer>}
      {!content && (
        <MainContainer className={className}>お探しの記事は見つかりませんでした</MainContainer>
      )}
      {content && (
        /* 2列（可変幅 + ボタン領域の幅）のグリッドを定義 */
        <article key={content.id} className="grid grid-cols-[1fr_6rem] grid-rows-[auto_1fr] gap-5">
          <SectionTitle content={content} />
          <SectionBody content={content} />
        </article>
      )}
    </MainContainer>
  );
};
