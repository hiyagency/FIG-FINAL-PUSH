"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({
  initialValues
}: {
  initialValues: {
    connectorToggles: Record<string, boolean>;
    enrichmentDepth: string;
    complianceText: string;
    dedupeSettings: Record<string, boolean>;
    exportDefaults: Record<string, string | boolean>;
  };
}) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Unable to save settings.");
      }

      toast.success("Settings updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_0.25fr]">
      <Card className="p-6">
        <h2 className="text-2xl font-display text-white">Connector and compliance settings</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Connectors</p>
            {Object.entries(values.connectorToggles).map(([key, enabled]) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
              >
                <span>{key}</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      connectorToggles: {
                        ...current.connectorToggles,
                        [key]: event.target.checked
                      }
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Enrichment depth</Label>
              <Input
                value={values.enrichmentDepth}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    enrichmentDepth: event.target.value
                  }))
                }
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Default export format</Label>
              <Input
                value={String(values.exportDefaults.format ?? "CSV")}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    exportDefaults: {
                      ...current.exportDefaults,
                      format: event.target.value
                    }
                  }))
                }
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Compliance copy</Label>
              <Textarea
                value={values.complianceText}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    complianceText: event.target.value
                  }))
                }
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
        <Button className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
      </Card>
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dedupe defaults</p>
        <div className="mt-4 space-y-3">
          {Object.entries(values.dedupeSettings).map(([key, enabled]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
            >
              <span>{key}</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    dedupeSettings: {
                      ...current.dedupeSettings,
                      [key]: event.target.checked
                    }
                  }))
                }
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
