export const demoWorkspace = {
  id: "workspace_demo",
  slug: "demo-studio",
  name: "Momentum Studio",
  description: "Agency workspace for coaches, creators, and B2B brands.",
  brand: {
    id: "brand_demo",
    name: "CoachFlow",
    niche: "Fitness coaching",
    offer: "High-ticket coaching",
    audience: "Busy founders and consultants"
  },
  dashboard: {
    stats: [
      {
        label: "Content pipeline velocity",
        value: "18 assets/day",
        hint: "Across ingest, diagnosis, edit planning, and scheduled publishing."
      },
      {
        label: "Median watch lift",
        value: "+27%",
        hint: "Fast-cut authority variants are outperforming the prior 20-post baseline."
      },
      {
        label: "Lead intent alerts",
        value: "7 hot threads",
        hint: "Comments and DMs routed for manual follow-up with saved reply suggestions."
      }
    ],
    diagnosis: {
      niche: "Consultant-led education",
      strongestAngles: [
        "Quick tactical authority",
        "Direct CTA at second 17",
        "Natural face-to-camera trust"
      ],
      weakPoints: ["First 2.4 seconds are too slow", "Subtitle block is visually dense"],
      reelTypes: ["Authority", "Organic social proof", "Fast-cut lead gen"],
      style: "Medium punch-ins, darker premium captions, no emoji CTA"
    },
    projectProgress: [
      { title: "Founder objections reel batch", stage: "Rendering variants", progress: 72 },
      { title: "Offer positioning edit pack", stage: "Waiting on approval", progress: 91 },
      { title: "Client onboarding hooks", stage: "Caption optimization", progress: 64 }
    ]
  },
  project: {
    id: "project_demo",
    title: "How creators lose leads in the first 3 seconds",
    funnelGoal: "Leads",
    diagnosisSummary:
      "Educational authority content with strong product mention and a soft CTA. Best with direct-response hooks and medium subtitle density.",
    variants: [
      {
        id: "variant_authority",
        name: "Authority direct-response",
        hook: "Your reel is losing warm leads before your offer even appears.",
        pacing: "Fast-cut authority",
        subtitleStyle: "Bold dark captions",
        cta: "Comment READY and we will DM the checklist.",
        confidence: "High confidence because prior direct CTA + 21-28s cuts outperform."
      },
      {
        id: "variant_organic",
        name: "Organic storytelling",
        hook: "I kept wondering why qualified leads watched but never booked.",
        pacing: "Clean conversational",
        subtitleStyle: "Minimal center captions",
        cta: "Save this before your next edit session.",
        confidence: "Medium confidence because storytelling is strong, but lead CTA is softer."
      },
      {
        id: "variant_trend",
        name: "Trend-framed remix",
        hook: "POV: your reel says ‘expert’ but your first three seconds say ‘skip’.",
        pacing: "Rhythmic punch-ins",
        subtitleStyle: "Trend caps with kinetic text",
        cta: "DM AUDIT for the breakdown.",
        confidence: "Experimental. Strong for reach testing, lower confidence for lead conversion."
      }
    ],
    hooks: [
      "Your reel looks polished, but it still loses qualified leads.",
      "Most creators are editing for views while killing buying intent.",
      "If your first line sounds like everyone else, your CTA never gets a chance."
    ],
    captions: {
      primary:
        "The first 3 seconds decide whether your reel builds authority or burns attention. Here’s how to stop sounding polished but forgettable and start creating short-form that drives real business outcomes.",
      hashtags: ["#shortformstrategy", "#contentops", "#instagramgrowth", "#leadgen"],
      seoTitle: "Fix the first 3 seconds of your reels",
      notes: "Authority tone with moderate direct-response language tested best in the last 20 posts."
    },
    analytics: {
      bestWindow: "Thursday 6:30 PM",
      bestTemplateFamily: "Fast-cut authority",
      bestCaptionLength: "110-145 words",
      bestCtaFamily: "Direct CTA with low-friction comment ask"
    }
  },
  calendar: [
    { day: "Tue", time: "6:30 PM", title: "Authority reel batch", status: "Scheduled" },
    { day: "Thu", time: "12:00 PM", title: "Organic credibility edit", status: "Approval pending" },
    { day: "Fri", time: "4:00 PM", title: "Experiment variant A/B", status: "Draft" }
  ],
  engagement: [
    {
      handle: "@ashcoaching",
      sentiment: "Positive",
      status: "Needs human",
      preview: "Can you send pricing? This looks exactly like what we need."
    },
    {
      handle: "@bizfitdaily",
      sentiment: "Neutral",
      status: "Auto-reply eligible",
      preview: "What editing style did you use for the subtitles?"
    },
    {
      handle: "@growwithmia",
      sentiment: "Risky",
      status: "Moderation review",
      preview: "Spammy giveaway bait detected by classifier."
    }
  ]
} as const;
