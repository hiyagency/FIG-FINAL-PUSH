import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: {
  className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-slate-700", className)} {...props} />;
}
