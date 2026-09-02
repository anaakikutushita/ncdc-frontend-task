import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonLabelProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "normal";
};

export const ButtonLabel = ({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLabelProps) => {
  // 読みやすいようにjoinを使って適度に改行しています
  const baseClasses = [
    "min-w-[40px] h-[40px]",
    "rounded",
    "text-xs",
    "font-semibold",
    "transition-all duration-150",
    "disabled:brightness-110",
    "disabled:opacity-50",
  ].join(" ");

  const variantClasses = {
    primary: [
      "bg-brand-20 text-white",
      "enabled:hover:bg-brand-30",
      "enabled:active:bg-brand-40",
    ].join(" "),
    secondary: [
      "bg-white",
      "border-3 border-brand-20",
      "text-brand-20",
      "enabled:hover:bg-black-20",
      "enabled:active:bg-black-30",
    ].join(" "),
    normal: [
      "bg-black-30",
      "text-white",
      "enabled:hover:bg-black-40",
      "enabled:active:bg-black-45",
    ].join(" "),
  };

  return (
    <button className={twMerge(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
};
