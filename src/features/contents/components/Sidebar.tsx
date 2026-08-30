import { useContents } from "@/features/contents/hooks";
import { useState } from "react";

const Loading = () => <div>Loading...</div>;

const ShowError = ({ message }: { message?: string }) => (
  <div>Error: {message || "no message"}</div>
);

const NoContents = () => <div>コンテンツがありません</div>;

const FooterButtons = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
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
          <button aria-label="new page">New page</button>
          <button aria-label="done" onClick={() => setIsEditing(false)}>
            Done
          </button>
        </>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const { contents, isLoading, error } = useContents();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <aside className="w-[280px] bg-light">
      {isLoading && <Loading />}
      {error && <ShowError message={error.message} />}
      {!contents?.length && !isLoading && !error && <NoContents />}
      {contents?.length && (
        <nav>
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {contents.map((content) => (
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
      <FooterButtons isEditing={isEditing} setIsEditing={setIsEditing} />
    </aside>
  );
};
