import { LabelButton } from "@/components/ui/LabelButton";
import { createContent, deleteContent, useContents } from "@/features/contents/hooks";
import { type Content } from "@/features/contents/schemas";
import { sortContentsByDesc } from "@/utils/sort";
import { useState } from "react";
import { SidebarItem } from "./SidebarItem";

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
        <LabelButton aria-label="edit" variant="primary" onClick={() => setIsEditing(true)}>
          Edit
        </LabelButton>
      )}
      {isEditing && (
        <>
          <LabelButton aria-label="new page" variant="secondary" onClick={handleCreate}>
            New page
          </LabelButton>
          <LabelButton aria-label="done" variant="primary" onClick={() => setIsEditing(false)}>
            Done
          </LabelButton>
        </>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const { contents, isLoading, error, mutate } = useContents();

  // createdAtの降順（新しいものが上）にソートして表示
  const sortedContents = sortContentsByDesc(contents || []);

  const handleCreate = async () => {
    try {
      // 1. APIを呼び出して新規コンテンツを作成
      const newContent = await createContent("新しいページ", "新しいページの本文を入力");

      // 2. SWRキャッシュの先頭に新しいデータを追加して画面を即時更新
      mutate((currentContents: Content[] = []) => [newContent, ...currentContents], {
        revalidate: false,
      });
    } catch (err) {
      console.error("作成に失敗しました", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContent(id);
      mutate(
        (currentContents: Content[] = []) => currentContents.filter((content) => content.id !== id),
        {
          revalidate: false,
        },
      );
    } catch (err) {
      console.error("削除に失敗しました", err);
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
              <SidebarItem
                key={content.id}
                content={content}
                isEditing={isEditing}
                onDelete={handleDelete}
              />
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
