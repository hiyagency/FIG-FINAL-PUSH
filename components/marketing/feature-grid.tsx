import { Bot, CalendarClock, Film, MessageSquareText, ShieldCheck, Wand2 } from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Film,
    title: "Media ingestion pipeline",
    description:
      "Resumable uploads, proxy generation, transcripts, scene detection, duplicate checks, and storage-safe validation."
  },
  {
    icon: Bot,
    title: "Structured AI planners",
    description:
      "Diagnosis, questionnaire, edit strategy, captions, originality, and engagement classifiers all run as validated JSON workflows."
  },
  {
    icon: Wand2,
    title: "Prompt-to-edit control",
    description:
      "Translate vague natural language into deterministic edit operations without destroying timeline state."
  },
  {
    icon: CalendarClock,
    title: "Publishing and experiments",
    description:
      "Preflight checks, queueing, retries, transparent capability fallbacks, scheduling, and experiment-first workflows."
  },
  {
    icon: MessageSquareText,
    title: "Approval and engagement ops",
    description:
      "Proof links, comments, DM handoff, saved replies, moderation safety rails, and hot lead routing."
  },
  {
    icon: ShieldCheck,
    title: "Production guardrails",
    description:
      "RBAC, audit logs, encrypted social tokens, structured logging, background jobs, feature flags, and billing enforcement."
  }
];

export function FeatureGrid() {
  return (
    <section className="page-shell py-24">
      <div className="mb-12 max-w-3xl">
        <p className="eyebrow mb-5">Platform modules</p>
        <h2 className="section-title">Built as a content operating system, not a single prompt on top of FFmpeg.</h2>
        <p className="section-copy mt-5">
          Every surface is designed for real teams: creators, client services,
          editors, strategists, and approvers operating from one multi-brand
          workspace.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 font-display text-2xl text-white">{feature.title}</h3>
              <p className="text-sm leading-7 text-slate-300">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
