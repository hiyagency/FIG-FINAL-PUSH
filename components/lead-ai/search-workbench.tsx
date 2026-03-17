"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ParsedSearchIntent } from "@/modules/lead-ai/contracts";
import { demoPrompts } from "@/modules/lead-ai/demo-prompts";
import { useSearchDraftStore } from "@/modules/lead-ai/search-store";

function IntentEditor({
  intent,
  onChange
}: {
  intent: ParsedSearchIntent;
  onChange: (next: ParsedSearchIntent) => void;
}) {
  const primaryLocation = intent.locations[0] ?? {};

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Industries</Label>
          <Input
            className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            value={intent.industries.join(", ")}
            onChange={(event) =>
              onChange({
                ...intent,
                industries: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Service needs</Label>
          <Input
            className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            value={intent.serviceNeeds.join(", ")}
            onChange={(event) =>
              onChange({
                ...intent,
                serviceNeeds: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Signals</Label>
          <Input
            className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            value={intent.signals.join(", ")}
            onChange={(event) =>
              onChange({
                ...intent,
                signals: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Country</Label>
            <Input
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              value={primaryLocation.country ?? ""}
              onChange={(event) =>
                onChange({
                  ...intent,
                  locations: [
                    {
                      ...primaryLocation,
                      country: event.target.value
                    }
                  ]
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">State</Label>
            <Input
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              value={primaryLocation.state ?? ""}
              onChange={(event) =>
                onChange({
                  ...intent,
                  locations: [
                    {
                      ...primaryLocation,
                      state: event.target.value
                    }
                  ]
                })
              }
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-300">City</Label>
            <Input
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              value={primaryLocation.city ?? ""}
              onChange={(event) =>
                onChange({
                  ...intent,
                  locations: [
                    {
                      ...primaryLocation,
                      city: event.target.value
                    }
                  ]
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Result limit</Label>
            <Input
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              type="number"
              min={1}
              max={250}
              value={intent.resultLimit}
              onChange={(event) =>
                onChange({
                  ...intent,
                  resultLimit: Number(event.target.value || "100")
                })
              }
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={intent.constraints.mustHaveEmail}
              onChange={(event) =>
                onChange({
                  ...intent,
                  constraints: {
                    ...intent.constraints,
                    mustHaveEmail: event.target.checked
                  }
                })
              }
            />
            Must include public business email
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={intent.constraints.mustHavePhone}
              onChange={(event) =>
                onChange({
                  ...intent,
                  constraints: {
                    ...intent.constraints,
                    mustHavePhone: event.target.checked
                  }
                })
              }
            />
            Must include public business phone
          </label>
        </div>
      </div>
    </div>
  );
}

export function SearchWorkbench() {
  const router = useRouter();
  const { rawPrompt, parsedIntent, setRawPrompt, setParsedIntent, reset } = useSearchDraftStore();
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!rawPrompt) {
      setRawPrompt(demoPrompts[0]);
    }
  }, [rawPrompt, setRawPrompt]);

  const readyIntent = useMemo(
    () =>
      parsedIntent ??
      ({
        rawPrompt,
        industries: [],
        subIndustries: [],
        serviceNeeds: [],
        locations: [{}],
        businessSize: "unknown",
        signals: [],
        contactPreferences: ["business_email", "business_phone"],
        constraints: {
          websitePresence: "any",
          mustHaveEmail: false,
          mustHavePhone: false,
          excludeDuplicates: true,
          onlyDomains: [],
          excludeDomains: []
        },
        resultLimit: 100,
        sortBy: "highest_opportunity"
      } satisfies ParsedSearchIntent),
    [parsedIntent, rawPrompt]
  );

  async function handleParse() {
    setIsParsing(true);

    try {
      const response = await fetch("/api/searches/parse", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          rawPrompt
        })
      });

      if (!response.ok) {
        throw new Error("Unable to parse prompt.");
      }

      const data = (await response.json()) as {
        intent: ParsedSearchIntent;
      };
      setParsedIntent(data.intent);
      toast.success("Prompt parsed into structured filters.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to parse prompt.");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleRunSearch() {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/searches", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          rawPrompt,
          intent: {
            ...readyIntent,
            rawPrompt
          }
        })
      });

      if (!response.ok) {
        throw new Error("Unable to start search.");
      }

      const data = (await response.json()) as {
        searchId: string;
      };
      reset();
      router.push(`/app/searches/${data.searchId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start search.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-slate-500">New search</p>
            <h2 className="mt-2 text-3xl font-display text-white">Describe your ideal customer profile</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Lead.ai parses your natural language into structured intent before discovery. Review and tweak filters, then launch a compliant multi-source search.
            </p>
          </div>
          <Button
            variant="secondary"
            className="hidden sm:inline-flex"
            onClick={() => setRawPrompt(demoPrompts[0])}
          >
            Use demo prompt
          </Button>
        </div>
        <div className="mt-6 grid gap-4">
          <Textarea
            value={rawPrompt}
            onChange={(event) => setRawPrompt(event.target.value)}
            className="min-h-[180px] border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            placeholder='Example: "Find restaurants in Indore without modern online ordering systems"'
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleParse} disabled={isParsing || !rawPrompt.trim()}>
              {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Parse prompt
            </Button>
            <Button
              variant="secondary"
              onClick={handleRunSearch}
              disabled={isSubmitting || !rawPrompt.trim()}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Run search
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Parsed filters</p>
          <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <IntentEditor intent={readyIntent} onChange={setParsedIntent} />
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Seed demos</p>
        <div className="mt-4 space-y-3">
          {demoPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
              onClick={() => {
                setRawPrompt(prompt);
                setParsedIntent(null);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-5">
          <p className="text-sm font-medium text-cyan-100">Compliance defaults</p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50/90">
            <li>Public business information only</li>
            <li>No personal emails or private profiles</li>
            <li>No CAPTCHAs, logins, or restricted access</li>
            <li>Every field tied to source evidence and confidence</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
