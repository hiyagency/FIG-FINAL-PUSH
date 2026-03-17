import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-dashed border-slate-700 bg-slate-950/35 p-8 text-center",
        className
      )}
    >
      <h3 className="mb-2 font-display text-2xl text-white">{title}</h3>
      <p className="mx-auto mb-5 max-w-xl text-sm text-slate-300">{description}</p>
      {action}
    </div>
  );
}
