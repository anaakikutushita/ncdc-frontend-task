import { LabelButton } from "@/components/ui/LabelButton";
import { type Content } from "@/features/contents/schemas";
import { useState } from "react";

type SectionTitleProps = {
  title: Content["title"];
};

export const SectionTitle = ({ title }: SectionTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);

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
            defaultValue={title}
            aria-label="タイトル"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <LabelButton
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
          >
            キャンセル
          </LabelButton>
        </>
      )}
    </header>
  );
};
