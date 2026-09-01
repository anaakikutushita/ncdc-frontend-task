import { type Content } from "@/features/contents/schemas";
import { useState } from "react";

type SectionBodyProps = {
  body: Content["body"];
};

export const SectionBody = ({ body }: SectionBodyProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="col-span-2 grid grid-cols-subgrid items-start">
      {!isEditing ? (
        <>
          <p className="body h-[400px] w-full overflow-y-auto p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap text-gray-800">
            {body}
          </p>
          <button
            className="edit text-sm font-medium text-blue-600 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
            aria-label="本文を編集"
          >
            編集
          </button>
        </>
      ) : (
        <>
          <textarea
            defaultValue={body}
            aria-label="本文"
            className="h-[400px] w-full p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
          >
            キャンセル
          </button>
        </>
      )}
    </div>
  );
};
