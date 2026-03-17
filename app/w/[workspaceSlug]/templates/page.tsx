import { Card } from "@/components/ui/card";

export default function TemplatesPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[
        ["Authority sprint", "Best for direct-response education", "Complexity 4"],
        ["Minimal credibility", "Corporate and premium", "Complexity 2"],
        ["Trend hybrid", "Experiment-first discovery", "Complexity 5"]
      ].map(([title, note, complexity]) => (
        <Card key={title} className="bg-white text-slate-950">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{complexity}</p>
          <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{note}</p>
        </Card>
      ))}
    </div>
  );
}
