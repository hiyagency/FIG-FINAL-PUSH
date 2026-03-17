import { Reveal } from "@/components/kittu/motion/reveal";
import { SectionJump } from "@/components/kittu/section-jump";
import { SectionIntro, SectionShell } from "@/components/kittu/section-shell";
import { storyContent } from "@/lib/kittu-content";

export function StorySection() {
  return (
    <SectionShell id="story">
      <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:gap-10">
        <Reveal>
          <SectionIntro
            eyebrow={storyContent.eyebrow}
            title={storyContent.title}
            description={storyContent.description}
            className="lg:sticky lg:top-24"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel-strong overflow-hidden p-6 sm:p-8">
            <div className="grid gap-7 xl:grid-cols-[1.18fr_0.82fr] xl:gap-8">
              <div className="space-y-5">
                {storyContent.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="section-copy border-l border-[rgba(148,92,108,0.18)] pl-4 text-[rgba(63,45,52,0.84)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="rounded-[28px] border border-[rgba(148,92,108,0.14)] bg-[rgba(255,252,250,0.88)] p-5 shadow-[0_22px_54px_-36px_rgba(43,31,41,0.36)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(98,58,73,0.78)]">
                  {storyContent.clarityTitle}
                </p>
                <div className="mt-5 space-y-4">
                  {storyContent.clarityPoints.map((point, index) => (
                    <div
                      key={point}
                      className="rounded-[22px] border border-[rgba(148,92,108,0.12)] bg-white/90 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(148,92,108,0.68)]">
                        0{index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[rgba(63,45,52,0.82)]">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SectionJump
              caption="Next page"
              label="Turn to the memories"
              targetId="memories"
              transitionLabel="Turn to the memories"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
