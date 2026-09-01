import { LabelButton } from "@/components/ui/LabelButton";
import { EP_CONTENT, updateContent, useContent } from "@/features/contents/hooks";
import { type Content, ContentSchema } from "@/features/contents/schemas";
import { useState } from "react";
import { useSWRConfig } from "swr";

type SectionTitleProps = {
  content: Content;
};

export const SectionTitle = ({ content }: SectionTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [error, setError] = useState<string | null>(null);

  // キャッシュ更新用
  const { mutate: mutateGlobal } = useSWRConfig(); // リストも更新するため、グローバルなmutateを取得
  const { mutate } = useContent(content.id);

  const handleSave = async () => {
    // Zodスキーマからタイトル部分だけを抽出してバリデーション
    const titleSchema = ContentSchema.pick({ title: true });
    const validation = titleSchema.safeParse({ title });

    if (!validation.success) {
      // 2. エラーがあれば、定義済みのエラーメッセージをセットして中断
      setError(validation.error.issues[0].message);
      return;
    }

    setError(null);
    try {
      // 3. API通信と楽観的更新
      await updateContent(content.id, { title });
      mutate((current: Content | undefined) => (current ? { ...current, title } : undefined), {
        revalidate: false,
      });
      // 4. グローバルなmutateを呼び出して、リストのタイトル一覧も更新
      mutateGlobal(EP_CONTENT);
      setIsEditing(false);
    } catch (err) {
      console.error("更新に失敗しました", err);
    }
  };

  const handleCancel = () => {
    setTitle(content.title); // 入力内容をリセット
    setError(null);
    setIsEditing(false);
  };

  return (
    <header className="col-span-2 grid grid-cols-subgrid items-start border-b pb-4">
      {!isEditing ? (
        <>
          <h2 className="title text-3xl font-bold text-gray-900 truncate">{title}</h2>
          <LabelButton
            className="edit text-sm font-medium text-blue-600 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
            aria-label="タイトルを編集"
          >
            編集
          </LabelButton>
        </>
      ) : (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="タイトル"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
          <LabelButton
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
          >
            保存
          </LabelButton>
          <LabelButton
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
          >
            キャンセル
          </LabelButton>
        </>
      )}
    </header>
  );
};
