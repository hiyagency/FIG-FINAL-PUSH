import { cn } from "@/lib/fig-utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="balance-text mt-5 text-3xl font-semibold leading-tight text-[#08152f] sm:text-4xl">
        {title}
      </h2>
      <p className="muted-copy mt-4">{description}</p>
    </div>
  );
}
