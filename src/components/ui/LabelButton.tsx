import type { ComponentProps, ReactNode } from "react";

type LabelButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "normal";
  icon?: ReactNode;
};

export const LabelButton = ({ variant = "primary", icon, children, ...props }: LabelButtonProps) => {
  // 読みやすいようにjoinを使って適度に改行しています
  const baseClasses = [
    "min-w-[40px] h-[40px]",
    "rounded p-1",
    "font-semibold",
    "transition-all duration-150",
    "grid grid-cols-1 gap-1 items-center justify-center",
  ].join(" ");
  const variantClasses = {
    primary: [
      "bg-brand-20 text-white",
      "hover:bg-brand-30",
      "active:bg-brand-40",
      "disabled:bg-brand-10",
    ].join(" "),
    secondary: [
      "bg-white",
      "border-3 border-brand-20",
      "text-brand-20",
      "hover:bg-black-20",
      "active:bg-black-30",
      "disabled:border-brand-10",
      "disabled:text-brand-10",
    ].join(" "),
    normal: [
      "bg-black-30",
      "text-white",
      "hover:bg-black-40",
      "active:bg-black-45",
      "disabled:bg-black-10",
    ].join(" "),
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && <span className="block">{icon}</span>}
      <span className="block">{children}</span>
    </button>
  );
};
