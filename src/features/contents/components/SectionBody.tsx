import { updateContent, useContent } from "@/features/contents/hooks";
import { ContentSchema, type Content } from "@/features/contents/schemas";
import { useState } from "react";
import { ButtonAction } from "./ButtonAction";

type SectionBodyProps = { content: Content };

export const SectionBody = ({ content }: SectionBodyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(content.body);
  const [error, setError] = useState<string | null>(null);

  const { mutate } = useContent(content.id);

  const handleSave = async () => {
    // Zodスキーマから本文部分だけを抽出してバリデーション
    const bodySchema = ContentSchema.pick({ body: true });
    const validation = bodySchema.safeParse({ body });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setError(null);
    try {
      await updateContent(content.id, { body });
      mutate((current: Content) => (current ? { ...current, body } : undefined), {
        revalidate: false,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("更新に失敗しました", err);
    }
  };

  const handleCancel = () => {
    setBody(content.body);
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="grid col-span-2 grid-cols-subgrid items-start">
      {!isEditing ? (
        <>
          <p className="overflow-y-auto p-[30px] bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
            {content.body}
          </p>
          <ButtonAction aria-label="本文を編集" action="edit" onClick={() => setIsEditing(true)} />
        </>
      ) : (
        <>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="本文"
            className={`w-full p-[30px] border rounded resize-none focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          <div className="flex space-x-2 justify-between">
            <ButtonAction
              aria-label="キャンセル"
              action="cancel"
              className="flex-1"
              onClick={handleCancel}
            />
            <ButtonAction aria-label="保存" action="save" className="flex-1" onClick={handleSave} />
          </div>
          {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
        </>
      )}
    </div>
  );
};
