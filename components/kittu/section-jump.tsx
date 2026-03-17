import { PageJumpButton } from "@/components/kittu/page-jump-button";

type SectionJumpProps = {
  caption: string;
  label: string;
  targetId: string;
  transitionLabel?: string;
};

export function SectionJump({
  caption,
  label,
  targetId,
  transitionLabel
}: SectionJumpProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:mt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(148,92,108,0.62)]">
        {caption}
      </p>
      <PageJumpButton
        label={label}
        targetId={targetId}
        transitionLabel={transitionLabel}
      />
    </div>
  );
}
