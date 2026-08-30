import { useContents } from "@/features/contents/hooks";

const Loading = () => <div>Loading...</div>;

const ShowError = ({ message }: { message?: string }) => <div>Error: {message || "no message"}</div>;

const NoContents = () => <div>コンテンツがありません</div>;

export const Sidebar = () => {
  const { contents, isLoading, error } = useContents();

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
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
};
