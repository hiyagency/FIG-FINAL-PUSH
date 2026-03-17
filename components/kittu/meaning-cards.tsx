import { Reveal } from "@/components/kittu/motion/reveal";
import { SectionJump } from "@/components/kittu/section-jump";
import { SectionIntro, SectionShell } from "@/components/kittu/section-shell";
import { meaningCards } from "@/lib/kittu-content";

export function MeaningCards() {
  return (
    <SectionShell id="meaning">
      <Reveal>
        <SectionIntro
          eyebrow="What I actually meant"
          title="The part beneath the bad decision."
          description="These are the simple truths I wish my actions had communicated more clearly."
          align="center"
        />
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {meaningCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.05}>
            <div className="soft-panel h-full p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(148,92,108,0.68)]">
                0{index + 1}
              </p>
              <h3 className="mt-4 text-[1.55rem] font-semibold leading-[1.02] text-[rgb(var(--foreground))]">
                {card.title}
              </h3>
              <p className="section-copy mt-4 text-[rgba(74,56,65,0.78)]">
                {card.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <SectionJump
          caption="Next page"
          label="Turn to the letter"
          targetId="letter"
          transitionLabel="Turn to the letter"
        />
      </Reveal>
    </SectionShell>
  );
}
