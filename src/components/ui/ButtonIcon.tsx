import type { ComponentProps, ReactNode } from "react";

type ButtonIconProps = ComponentProps<"button"> & {
  icon: ReactNode;
};

export const ButtonIcon = ({ icon, ...props }: ButtonIconProps) => {
  return (
    <button
      {...props}
      className={[
        "cursor-pointer",
        "min-w-6 w-6 h-6",
        "rounded",
        "flex items-center justify-center",
        "hover:brightness-90",
        "hover:bg-black-10",
        "active:brightness-75",
        "disabled:brightness-100",
        "disabled:opacity-50",
      ].join(" ")}
    >
      {icon}
    </button>
  );
};
