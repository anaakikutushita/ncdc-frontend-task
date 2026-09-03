import { LogoLockup } from "@/components/logo/LogoLockup";
import { ButtonAction } from "@/features/contents/components/ButtonAction";
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
    <div className="p-3 bg-surface-light flex space-x-2 justify-between items-center">
      {!isEditing && (
        <>
          {/* justify-between でボタンを右寄せにするために空要素を配置 */}
          <div role="none"></div>
          <ButtonAction
            aria-label="edit"
            action="edit"
            className="min-w-[96px]"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </ButtonAction>
        </>
      )}
      {isEditing && (
        <>
          <ButtonAction
            aria-label="new page"
            action="new"
            className="min-w-[96px]"
            onClick={handleCreate}
          >
            New page
          </ButtonAction>
          <ButtonAction
            aria-label="done"
            action="done"
            className="min-w-[96px]"
            onClick={() => setIsEditing(false)}
          >
            Done
          </ButtonAction>
        </>
      )}
    </div>
  );
};

type SidebarProps = {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

export const Sidebar = ({ selectedId, onSelect }: SidebarProps) => {
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

      // 削除対象が現在表示中の記事だった場合、メインエリアの表示をクリアする
      if (id === selectedId) {
        onSelect(null);
      }
    } catch (err) {
      console.error("削除に失敗しました", err);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  return (
    <aside
      className={[
        "w-[280px] bg-white",
        "border-r-[1px] border-surface-light",
        "flex flex-col items-stretch justify-between",
      ].join(" ")}
    >
      <div role="none" className="pt-[30px] pl-[40px] pr-0 flex flex-col min-h-0 gap-5">
        <LogoLockup />
        {isLoading && <Loading />}
        {error && <ShowError message={error.message} />}
        {!contents?.length && !isLoading && !error && <NoContents />}
        {contents?.length && (
          <nav className="flex min-h-0 flex-col">
            <ul className="min-h-0 flex-1 overflow-y-auto space-y-1 scrollbar-gutter-stable">
              {sortedContents?.map((content) => (
                <SidebarItem
                  key={content.id}
                  content={content}
                  isEditing={isEditing}
                  isSelected={selectedId === content.id}
                  onSelect={onSelect}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </nav>
        )}
      </div>
      <FooterButtons
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleCreate={handleCreate}
      />
    </aside>
  );
};
