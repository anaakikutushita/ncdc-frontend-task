import { useState } from "react";
import { useContent } from "@/features/contents/hooks";

type MainAreaProps = {
  selectedId: number | null;
};

export const MainArea = ({ selectedId }: MainAreaProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);

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
      {/* タイトル領域 */}
      <article>
        <header className="flex items-start justify-between border-b pb-4">
          {!isEditingTitle ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 truncate">{content.title}</h2>
              <button
                onClick={() => setIsEditingTitle(true)}
                aria-label="タイトルを編集"
                className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0"
              >
                編集
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                defaultValue={content.title}
                aria-label="タイトル"
                className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setIsEditingTitle(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                キャンセル
              </button>
            </>
          )}
        </header>
        {/* 本文領域 */}
        <div>
          {!isEditingBody ? (
            <div className="flex items-start justify-between gap-4">
              <p className="body flex-1 h-[400px] overflow-y-auto p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap text-gray-800">
                {content.body}
              </p>
              <button
                className="edit text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0"
                onClick={() => setIsEditingBody(true)}
                aria-label="本文を編集"
              >
                編集
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                defaultValue={content.body}
                aria-label="本文"
                className="h-[400px] p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditingBody(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </article>

      <footer className="flex justify-between items-center">
        <p>Copyright © 2021 Sample</p>
        <p>運営会社</p>
      </footer>
    </main>
  );
};
