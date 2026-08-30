import { createContent, useContents } from "@/features/contents/hooks";
import { useState } from "react";

const Loading = () => <div>Loading...</div>;

const ShowError = ({ message }: { message?: string }) => (
  <div>Error: {message || "no message"}</div>
);

const NoContents = () => <div>コンテンツがありません</div>;

const FooterButtons = ({
  isEditing,
  setIsEditing,
  handleCreate,
}: {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleCreate?: () => Promise<void>;
}) => {
  return (
    <div className="flex space-x-2">
      {!isEditing && (
        <button aria-label="edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      {isEditing && (
        <>
          <button aria-label="new page" onClick={handleCreate}>
            New page
          </button>
          <button aria-label="done" onClick={() => setIsEditing(false)}>
            Done
          </button>
        </>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const { contents, isLoading, error, mutate } = useContents();

  // 追加仕様: createdAtの降順（新しいものが上）にソートして表示
  // TODO: 別の関数として切り出してテストを追加する
  const sortedContents = contents?.sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
  );

  const handleCreate = async () => {
    try {
      // 1. APIを呼び出して新規コンテンツを作成
      const newContent = await createContent("新しいページ", "新しいページの本文を入力");

      // 2. SWRキャッシュの先頭に新しいデータを追加して画面を即時更新
      mutate((currentContents = []) => [newContent, ...currentContents], { revalidate: false });
    } catch (err) {
      console.error("作成に失敗しました", err);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  return (
    <aside className="w-[280px] bg-light">
      {isLoading && <Loading />}
      {error && <ShowError message={error.message} />}
      {!contents?.length && !isLoading && !error && <NoContents />}
      {contents?.length && (
        <nav>
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {sortedContents?.map((content) => (
              <li
                key={content.id}
                className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
              >
                <span className="block truncate text-sm">{content.title || "タイトルなし"}</span>
                {isEditing && <button aria-label="delete">delete</button>}
              </li>
            ))}
          </ul>
        </nav>
      )}
      <FooterButtons
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleCreate={handleCreate}
      />
    </aside>
  );
};
