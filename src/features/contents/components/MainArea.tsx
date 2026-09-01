import { useContent } from "@/features/contents/hooks";
import { SectionBody } from "./SectionBody.tsx";
import { SectionTitle } from "./SectionTitle.tsx";

type MainAreaProps = {
  selectedId: number | null;
};

export const MainArea = ({ selectedId }: MainAreaProps) => {
  // 万が一 undefined が返ってきた場合のエラーを防ぐため {} でフォールバック
  const { content, isLoading, error } = useContent(selectedId) || {};

  if (selectedId === null) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-gray-500 bg-white">
        ページを選択してください
      </div>
    );
  }

  if (isLoading) return <div className="flex-1 p-8">読み込み中...</div>;
  if (error) return <div className="flex-1 p-8 text-red-500">エラーが発生しました</div>;
  if (!content) return null;

  return (
    <main className="flex-1 p-8 flex flex-col gap-6 bg-white overflow-hidden">
      {/* 2列（可変幅 + ボタン領域の幅）のグリッドを定義 */}
      <article className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-6">
        <SectionTitle content={content} />
        <SectionBody body={content.body} />
      </article>

      <footer className="flex justify-between items-center">
        <p>Copyright © 2021 Sample</p>
        <p>運営会社</p>
      </footer>
    </main>
  );
};
