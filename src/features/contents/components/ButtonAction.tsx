import cancelIcon from "@/assets/cancel.svg";
import doneIcon from "@/assets/done.svg";
import editIcon from "@/assets/edit.svg";
import { ButtonLabel } from "@/components/ui/ButtonLabel";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonActionProps = ComponentProps<"button"> & {
  action: "edit" | "done" | "cancel";
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
    cancel: {
      variant: "normal",
      label: "Cancel",
      icon: cancelIcon,
    },
  } as const;

  const appearance = appearanceMap[action];

  return (
    <ButtonLabel
      variant={appearance.variant}
      className={twMerge("grid grid-cols-1 gap-0 place-items-center", className)}
      {...props}
    >
      <img src={appearance.icon} alt={appearance.label} className="w-6 h-6 text-brand-20" />
      {appearance.label}
    </ButtonLabel>
  );
};
