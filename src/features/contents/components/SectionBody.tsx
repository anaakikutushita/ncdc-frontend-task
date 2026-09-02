import { ButtonLabel } from "@/components/ui/ButtonLabel";
import { updateContent, useContent } from "@/features/contents/hooks";
import { ContentSchema, type Content } from "@/features/contents/schemas";
import { useState } from "react";

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
    <div className="col-span-2 grid grid-cols-subgrid items-start">
      {!isEditing ? (
        <>
          <p className="body h-[400px] w-full overflow-y-auto p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap text-gray-800">
            {content.body}
          </p>
          <ButtonLabel
            className="edit text-sm font-medium text-blue-600 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
            aria-label="本文を編集"
          >
            編集
          </ButtonLabel>
        </>
      ) : (
        <>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="本文"
            className={`h-[400px] w-full p-4 border rounded resize-none focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
          <div className="flex flex-col gap-2 shrink-0">
            <ButtonLabel
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded whitespace-nowrap"
            >
              保存
            </ButtonLabel>
            <ButtonLabel
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
            >
              キャンセル
            </ButtonLabel>
          </div>
        </>
      )}
    </div>
  );
};
