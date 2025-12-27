import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
  base: "font-medium bg-blue-500 text-white rounded active:opacity-80 flex items-center justify-center",
  variants: {
    variant: {
      primary: "bg-slate-600 text-white",
      default: "bg-white text-black",
    },
    size: {
      sm: "text-sm h-6",
      md: "text-sm h-10",
      lg: "px-4 py-3 h-12 text-lg",
    },
    full: {
      true: "w-full",
      false: "",
    },
  },
  compoundVariants: [
    {
      size: ["sm", "md"],
      class: "px-3 py-1",
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "default",
    full: false,
  },
});

export type ButtonVariants = VariantProps<typeof button>;

function Button({
  className,
  size,
  variant,
  full,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariants & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(button({ size, variant, className, full }))}
      {...props}
    />
  );
}

export { Button };
