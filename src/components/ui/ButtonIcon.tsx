import type { ComponentProps, ReactNode } from "react";

type ButtonIconProps = ComponentProps<"button"> & {
  icon: ReactNode;
};

export const ButtonIcon = ({ icon, ...props }: ButtonIconProps) => {
  return (
    <button
      {...props}
      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
    >
      {icon}
    </button>
  );
};
