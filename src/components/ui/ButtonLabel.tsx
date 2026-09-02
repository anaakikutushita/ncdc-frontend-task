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
    <button className={twMerge(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
};
