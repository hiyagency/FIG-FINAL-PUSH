export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#040a14] px-5 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#07111f] shadow-[0_30px_100px_-48px_rgba(15,23,42,0.65)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden border-r border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(35,192,255,0.18),transparent_35%),linear-gradient(180deg,#07111f_0%,#09182c_100%)] p-10 text-white lg:block">
          <p className="eyebrow mb-5">Lead.ai</p>
          <h1 className="font-display text-5xl leading-tight">
            Find your next best clients from public business signals.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
            AI-guided prompt parsing, compliant connector fan-out, website audits,
            scoring, saved lists, campaigns, and exports all live inside one production-ready workspace.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-10">{children}</div>
      </div>
    </div>
  );
}
