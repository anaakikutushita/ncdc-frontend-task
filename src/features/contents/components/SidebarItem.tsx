import trashIcon from "@/assets/delete.svg";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { type Content } from "../schemas";

type SidebarItemProps = {
  content: Content;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

export const SidebarItem = ({
  content,
  isEditing,
  isSelected,
  onSelect,
  onDelete,
}: SidebarItemProps) => {
  return (
    <li
      onClick={() => onSelect(content.id)}
      className={`h-11 p-2 rounded flex justify-between items-center transition-colors group cursor-pointer ${
        isSelected ? "bg-surface-light text-brand-50 font-bold" : "hover:bg-gray-200"
      }`}
    >
      <span className="block truncate text-sm pointer-events-none">
        {content.title || "タイトルなし"}
      </span>
      {isEditing && (
        <ButtonIcon
          aria-label="delete"
          icon={<img src={trashIcon} alt="Delete" />}
          onClick={(e) => {
            e.stopPropagation(); // クリックイベントが伝播してonSelectが発火するのを防ぐ
            onDelete(content.id);
          }}
        />
      )}
    </li>
  );
};
