import { Reveal } from "@/components/kittu/motion/reveal";
import { SectionJump } from "@/components/kittu/section-jump";
import { SectionIntro, SectionShell } from "@/components/kittu/section-shell";
import { MemoryGalleryClient } from "@/components/kittu/memory-gallery-client";
import { galleryContent } from "@/lib/kittu-content";
import type { GalleryItem } from "@/lib/kittu-gallery";

export function MemoryGallery({ items }: { items: GalleryItem[] }) {
  return (
    <SectionShell id="memories">
      <Reveal>
        <SectionIntro
          eyebrow={galleryContent.eyebrow}
          title={galleryContent.title}
          description={galleryContent.description}
          align="center"
        />
      </Reveal>

      <Reveal delay={0.08} className="mt-10 sm:mt-12">
        <div className="space-y-8">
          <MemoryGalleryClient items={items} />
          <SectionJump
            caption="Next page"
            label="Turn to what I meant"
            targetId="meaning"
            transitionLabel="Turn to what I meant"
          />
        </div>
      </Reveal>
    </SectionShell>
  );
}
