import { saveBrandDnaAction } from "@/app/w/[workspaceSlug]/brand-dna/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function BrandDnaPage() {
  const state = await getLocalStudioState();
  const brandDna = state.brandDna;

  return (
    <div className="light-panel p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Brand DNA</p>
      <h2 className="mt-3 font-display text-3xl text-slate-950">
        Save your voice, style, and editing defaults once.
      </h2>
      <form action={saveBrandDnaAction} className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Brand name</Label>
          <Input name="brandName" defaultValue={brandDna.brandName} />
        </div>
        <div className="space-y-2">
          <Label>Niche</Label>
          <Input name="niche" defaultValue={brandDna.niche} />
        </div>
        <div className="space-y-2">
          <Label>Offer type</Label>
          <Input name="offerType" defaultValue={brandDna.offerType} />
        </div>
        <div className="space-y-2">
          <Label>Target audience</Label>
          <Input name="targetAudience" defaultValue={brandDna.targetAudience} />
        </div>
        <div className="space-y-2">
          <Label>Preferred caption style</Label>
          <Input name="preferredCaptionStyle" defaultValue={brandDna.preferredCaptionStyle} />
        </div>
        <div className="space-y-2">
          <Label>Preferred hook style</Label>
          <Input name="preferredHookStyle" defaultValue={brandDna.preferredHookStyle} />
        </div>
        <div className="space-y-2">
          <Label>Pacing style</Label>
          <Input name="pacingStyle" defaultValue={brandDna.pacingStyle} />
        </div>
        <div className="space-y-2">
          <Label>Subtitle style</Label>
          <Input name="subtitleStyle" defaultValue={brandDna.subtitleStyle} />
        </div>
        <div className="space-y-2">
          <Label>CTA tone</Label>
          <Input name="ctaTone" defaultValue={brandDna.ctaTone} />
        </div>
        <div className="space-y-2">
          <Label>Audio vibe</Label>
          <Input name="audioVibe" defaultValue={brandDna.audioVibe} />
        </div>
        <div className="space-y-2">
          <Label>Platform goals</Label>
          <Input
            name="platformGoals"
            defaultValue={brandDna.platformGoals.join(", ")}
            placeholder="followers, leads, sales"
          />
        </div>
        <div className="space-y-2">
          <Label>Posting languages</Label>
          <Input
            name="postingLanguages"
            defaultValue={brandDna.postingLanguages.join(", ")}
          />
        </div>
        <div className="space-y-2">
          <Label>Banned words</Label>
          <Input
            name="bannedWords"
            defaultValue={brandDna.bannedWords.join(", ")}
            placeholder="hack, hustle"
          />
        </div>
        <div className="space-y-2">
          <Label>Preferred words</Label>
          <Input
            name="preferredWords"
            defaultValue={brandDna.preferredWords.join(", ")}
            placeholder="clarity, trust"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Compliance notes</Label>
          <Textarea
            name="complianceNotes"
            defaultValue={brandDna.complianceNotes}
            placeholder="Add any promises, claims, or wording rules to avoid."
          />
        </div>
        <div className="md:col-span-2">
          <SubmitButton pendingLabel="Saving Brand DNA...">Save Brand DNA</SubmitButton>
        </div>
      </form>
    </div>
  );
}
