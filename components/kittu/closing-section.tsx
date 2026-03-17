import { Reveal } from "@/components/kittu/motion/reveal";
import { PageJumpButton } from "@/components/kittu/page-jump-button";
import { SectionShell } from "@/components/kittu/section-shell";
import { closingContent } from "@/lib/kittu-content";

export function ClosingSection({ stamp }: { stamp: string }) {
  return (
    <SectionShell id="closing" className="pb-6 sm:pb-8">
      <Reveal>
        <div className="soft-panel-strong mx-auto max-w-3xl overflow-hidden px-6 py-8 text-center sm:px-10 sm:py-10">
          <span className="eyebrow">{closingContent.eyebrow}</span>
          <h2 className="balance-text mt-6 text-4xl font-semibold leading-[0.98] text-[rgb(var(--foreground))] sm:text-5xl">
            {closingContent.title}
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl text-[rgba(74,56,65,0.78)]">
            {closingContent.body}
          </p>

          <div className="mt-8 flex justify-center">
            <PageJumpButton
              label={closingContent.button.label}
              targetId="top"
              transitionLabel="Back to the beginning"
            />
          </div>

          <div className="mt-8 text-[12px] uppercase tracking-[0.24em] text-[rgba(148,92,108,0.64)]">
            {closingContent.detail} / {stamp}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
