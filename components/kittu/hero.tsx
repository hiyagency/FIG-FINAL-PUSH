import { Reveal } from "@/components/kittu/motion/reveal";
import { PageJumpButton } from "@/components/kittu/page-jump-button";
import { SectionShell } from "@/components/kittu/section-shell";
import { heroContent } from "@/lib/kittu-content";

export function Hero() {
  return (
    <SectionShell id="top" className="pt-6 sm:pt-10 lg:pt-14">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]" />
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">{heroContent.eyebrow}</span>
            <h1 className="balance-text mt-6 text-5xl font-semibold leading-[0.94] text-[rgb(var(--foreground))] sm:text-6xl lg:text-[5.5rem]">
              {heroContent.title}
            </h1>
            <p className="section-copy mt-6 max-w-2xl text-base text-[rgba(74,56,65,0.82)] sm:text-lg">
              {heroContent.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PageJumpButton
                label={heroContent.primaryCta.label}
                targetId="story"
                transitionLabel="Open the note"
                variant="primary"
              />
              <PageJumpButton
                label={heroContent.secondaryCta.label}
                targetId="memories"
                transitionLabel="Turn to the memories"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(148,92,108,0.1),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.32),transparent)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(98,58,73,0.78)]">
                {heroContent.asideTitle}
              </p>
              <div className="mt-6 space-y-4">
                {heroContent.asideLines.map((line, index) => (
                  <div
                    key={line}
                    className="rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[0_18px_38px_-30px_rgba(43,31,41,0.45)] backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(148,92,108,0.7)]">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-[15px] leading-7 text-[rgba(54,38,45,0.88)]">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
