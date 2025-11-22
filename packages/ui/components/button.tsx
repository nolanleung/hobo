import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
  base: "font-medium bg-blue-500 text-white rounded active:opacity-80 py-",
  variants: {
    variant: {
      primary: "bg-slate-600 text-white",
      default: "bg-white text-black",
    },
    size: {
      sm: "text-sm h-6",
      md: "text-base h-8",
      lg: "px-4 py-3 h-10 text-lg",
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
  },
});

export type ButtonVariants = VariantProps<typeof button>;

function Button({
  className,
  size,
  variant,
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
      className={cn(button({ size, variant, className }))}
      {...props}
    />
  );
}

export { Button };
