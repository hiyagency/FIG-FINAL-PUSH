import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "1. Ingest",
    copy: "Upload raw media, logos, music, references, and B-roll with resumable signed uploads."
  },
  {
    title: "2. Diagnose",
    copy: "Infer niche, intent, energy, weak points, retention risk, and recommended reel types."
  },
  {
    title: "3. Generate",
    copy: "Render 3-5 variants with different hooks, pacing, captions, CTA framing, and confidence notes."
  },
  {
    title: "4. Refine",
    copy: "Use prompts or the timeline editor to adjust subtitles, cuts, cover frames, overlays, and audio."
  },
  {
    title: "5. Publish",
    copy: "Schedule or queue for Instagram with capability-aware validation and audit logs."
  },
  {
    title: "6. Learn",
    copy: "Persist winning hooks, CTA families, post windows, and pacing traits back into growth memory."
  }
];

export function WorkflowSection() {
  return (
    <section className="page-shell py-24">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border-b border-white/10 bg-slate-900/85 p-8 lg:border-b-0 lg:border-r">
            <p className="eyebrow mb-5">Execution flow</p>
            <h2 className="section-title max-w-md text-4xl">
              One system for edit ops, approvals, publishing, and learning.
            </h2>
            <p className="section-copy mt-5">
              The platform is built around resilient jobs, typed planners, and
              saved performance memory so every batch gets smarter over time.
            </p>
          </div>
          <div className="grid gap-px bg-white/10">
            {steps.map((step) => (
              <div key={step.title} className="bg-slate-950/55 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-300">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
