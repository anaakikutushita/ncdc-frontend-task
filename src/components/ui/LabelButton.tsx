import type { ComponentProps } from "react";

type LabelButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "normal";
};

export const LabelButton = ({ variant = "primary", children, ...props }: LabelButtonProps) => {
  const baseClasses = "rounded font-semibold";
  const variantClasses = {
    primary: "bg-primary hover:bg-blue-600 text-white",
    secondary: "bg-secondary hover:bg-gray-600 text-primary",
    normal: "bg-normal hover:bg-red-600 text-white",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
