import trashIcon from "@/assets/delete.svg";
import { IconButton } from "@/components/ui/IconButton";
import { type Content } from "../schemas";

type SidebarItemProps = {
  content: Content;
  isEditing: boolean;
  onDelete: (id: number) => void;
};

export const SidebarItem = ({ content, isEditing, onDelete }: SidebarItemProps) => {
  return (
    <li className="p-2 hover:bg-gray-200 rounded flex justify-between items-center transition-colors group cursor-pointer">
      <span className="block truncate text-sm">{content.title || "タイトルなし"}</span>
      {isEditing && (
        <IconButton
          aria-label="delete"
          icon={<img src={trashIcon} alt="Delete" />}
          onClick={(e) => {
            e.stopPropagation(); // クリックイベントが親要素に伝播するのを防ぐ
            onDelete(content.id);
          }}
        />
      )}
    </li>
  );
};
