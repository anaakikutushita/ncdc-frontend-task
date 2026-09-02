import cancelIcon from "@/assets/cancel.svg";
import doneIcon from "@/assets/done.svg";
import editIcon from "@/assets/edit.svg";
import plusIcon from "@/assets/+.svg";
import saveIcon from "@/assets/save.svg";
import { ButtonLabel } from "@/components/ui/ButtonLabel";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonActionProps = ComponentProps<"button"> & {
  action: "edit" | "done" | "cancel" | "new" | "save";
};

export const ButtonAction = ({ className, action, ...props }: ButtonActionProps) => {
  const appearanceMap = {
    edit: {
      variant: "primary",
      label: "Edit",
      icon: editIcon,
    },
    done: {
      variant: "secondary",
      label: "Done",
      icon: doneIcon,
    },
    new: {
      variant: "secondary",
      label: "New page",
      icon: plusIcon,
    },
    cancel: {
      variant: "normal",
      label: "Cancel",
      icon: cancelIcon,
    },
    save: {
      variant: "primary",
      label: "Save",
      icon: saveIcon,
    },
  } as const;

  const appearance = appearanceMap[action];

  return (
    <ButtonLabel
      variant={appearance.variant}
      className={twMerge("grid grid-cols-1 grid-rows-[1fr_auto] gap-0 place-items-center", className)}
      {...props}
    >
      <img src={appearance.icon} alt={appearance.label} className="w-6 h-6 min-h-0 text-brand-20" />
      <span className="min-h-0">{appearance.label}</span>
    </ButtonLabel>
  );
};
