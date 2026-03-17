import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
};

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionShell({
  children,
  className,
  containerClassName,
  id
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("relative section-shell scroll-mt-16 sm:scroll-mt-24", className)}
    >
      <div className={cn("page-shell", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: SectionIntroProps) {
  const isCentered = align === "center";

  return (
    <div className={cn(isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="balance-text mt-5 text-4xl font-semibold leading-[0.98] text-[rgb(var(--foreground))] sm:text-5xl">
        {title}
      </h2>
      <p
        className={cn(
          "section-copy mt-4 max-w-2xl text-[rgba(74,56,65,0.78)]",
          isCentered && "mx-auto"
        )}
      >
        {description}
      </p>
    </div>
  );
}
