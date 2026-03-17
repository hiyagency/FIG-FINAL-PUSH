import { Reveal } from "@/components/kittu/motion/reveal";
import { SectionJump } from "@/components/kittu/section-jump";
import { SectionIntro, SectionShell } from "@/components/kittu/section-shell";
import { letterContent } from "@/lib/kittu-content";

export function LetterSection() {
  return (
    <SectionShell id="letter">
      <Reveal>
        <SectionIntro
          eyebrow={letterContent.eyebrow}
          title={letterContent.title}
          description={letterContent.description}
          align="center"
        />
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <div className="letter-paper soft-panel-strong mx-auto max-w-4xl rounded-[34px] p-6 sm:p-10 lg:p-14">
          <p className="text-4xl italic text-[rgba(83,49,63,0.95)] sm:text-[2.8rem]">
            {letterContent.greeting}
          </p>

          <div className="mt-8 space-y-5">
            {letterContent.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="section-copy text-base leading-8 text-[rgba(58,41,48,0.86)] sm:text-[1.03rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-10 text-xl italic text-[rgba(98,58,73,0.9)]">
            {letterContent.signOff}
          </p>

          <SectionJump
            caption="Final page"
            label="Turn to the ending"
            targetId="closing"
            transitionLabel="Turn to the ending"
          />
        </div>
      </Reveal>
    </SectionShell>
  );
}
