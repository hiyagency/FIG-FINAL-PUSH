import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-panel backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>{children}</div>;
}

export function CardTitle({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={cn("font-display text-xl text-white", className)}>{children}</h3>;
}

export function CardDescription({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("text-sm text-slate-300", className)}>{children}</p>;
}
