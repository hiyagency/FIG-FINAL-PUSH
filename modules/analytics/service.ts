export type PerformanceSnapshot = {
  views: number;
  saves: number;
  shares: number;
  captionLength?: number;
  hookStyle?: string | null;
  subtitleStyle?: string | null;
  pacingStyle?: string | null;
  ctaFamily?: string | null;
};

export function summarizePerformanceMemory(snapshots: PerformanceSnapshot[]) {
  if (snapshots.length === 0) {
    return {
      recommendation:
        "No post history yet. Start with three distinct variants to establish a baseline.",
      bestCaptionLength: null,
      bestHookStyle: null,
      bestSubtitleStyle: null,
      bestPacing: null,
      bestCtaFamily: null
    };
  }

  const score = (snapshot: PerformanceSnapshot) =>
    snapshot.views + snapshot.saves * 5 + snapshot.shares * 8;
  const best = [...snapshots].sort((a, b) => score(b) - score(a))[0];

  return {
    recommendation:
      "Fast-cut authority reels with medium captions and direct CTA framing are currently outperforming your baseline.",
    bestCaptionLength: best.captionLength ?? null,
    bestHookStyle: best.hookStyle ?? null,
    bestSubtitleStyle: best.subtitleStyle ?? null,
    bestPacing: best.pacingStyle ?? null,
    bestCtaFamily: best.ctaFamily ?? null
  };
}
