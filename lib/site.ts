import { getSiteUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Lead.ai",
  title: "Lead.ai | AI-powered B2B lead discovery",
  ogTitle: "Lead.ai",
  description:
    "Find high-fit B2B prospects from lawful public business sources, score opportunity, and export research-ready lead lists with source-backed confidence.",
  themeColor: "#07111f",
  url: getSiteUrl()
} as const;

export const mainNav = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" }
] as const;

export const marketingStats = [
  { label: "Signals scored per lead", value: "25+" },
  { label: "Connector fan-out per search", value: "4x" },
  { label: "Compliance posture", value: "Public-only" }
] as const;
