import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = ComponentProps<"button"> & {
  icon: ReactNode;
};

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
  return (
    <button
      {...props}
      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
    >
      {icon}
    </button>
  );
};
