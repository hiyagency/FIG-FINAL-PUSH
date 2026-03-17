import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/8 text-slate-200",
        accent: "border-brand-400/30 bg-brand-500/12 text-brand-100",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        neutral: "border-slate-200 bg-white text-slate-800"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
