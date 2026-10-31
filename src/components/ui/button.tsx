import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-[background-color,color,opacity,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "h-11 bg-forest px-5 text-on-forest hover:bg-forest-deep",
        secondary: "h-11 border border-line bg-surface px-5 text-ink hover:bg-paper-2",
        ghost: "h-11 bg-transparent px-3 text-ink hover:bg-paper-2",
        quiet: "h-9 bg-paper-2 px-3 text-ink hover:bg-line",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, asChild, type = "button", ...props }: Props) {
  if (asChild) {
    return <Slot className={cn(buttonVariants({ variant }), className)} {...props} />;
  }
  return <button className={cn(buttonVariants({ variant }), className)} type={type} {...props} />;
}
