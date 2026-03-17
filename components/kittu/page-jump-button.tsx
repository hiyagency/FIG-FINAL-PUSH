"use client";

import { ArrowDownRight } from "lucide-react";

import { usePageTransition } from "@/components/kittu/motion/page-transition-provider";
import { cn } from "@/lib/utils";

type PageJumpButtonProps = {
  className?: string;
  label: string;
  targetId: string;
  transitionLabel?: string;
  variant?: "primary" | "secondary";
};

export function PageJumpButton({
  className,
  label,
  targetId,
  transitionLabel,
  variant = "secondary"
}: PageJumpButtonProps) {
  const { jumpTo } = usePageTransition();

  return (
    <button
      type="button"
      onClick={() => jumpTo(targetId, transitionLabel)}
      className={cn(
        variant === "primary" ? "action-button" : "secondary-button",
        className
      )}
    >
      {label}
      <ArrowDownRight className="h-4 w-4" />
    </button>
  );
}
