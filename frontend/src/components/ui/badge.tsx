import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]",
        secondary: "border-transparent bg-[var(--secondary)] text-[var(--foreground)]",
        destructive: "border-transparent bg-[var(--destructive)] text-white",
        outline: "text-[var(--foreground)]",
        success: "border-transparent bg-[var(--success)]/20 text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning)]/20 text-[var(--warning)]",
        heat: "border-transparent bg-[var(--heat)]/20 text-[var(--heat)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
