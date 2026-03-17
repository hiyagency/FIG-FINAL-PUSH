export function SectionDivider() {
  return (
    <div aria-hidden="true" className="page-shell py-2 sm:py-3">
      <div className="hairline-divider">
        <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(148,92,108,0.28))]" />
        <div className="h-2.5 w-2.5 rotate-45 rounded-[3px] border border-[rgba(148,92,108,0.26)] bg-white/80 shadow-[0_8px_20px_-14px_rgba(98,58,73,0.8)]" />
        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(148,92,108,0.28),transparent)]" />
      </div>
    </div>
  );
}
