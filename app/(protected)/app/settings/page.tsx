import { SettingsForm } from "@/components/lead-ai/settings-form";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { getSettingsData } from "@/modules/lead-ai/service";

export default async function SettingsPage() {
  const session = await getServerAuthSession();
  const settings = await getSettingsData(session!.user.id);

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Settings</p>
        <h2 className="mt-3 text-4xl font-display text-white">Connector, compliance, and export defaults</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Configure which public-source connectors are active, how deep enrichment should go, and how lead dedupe/export defaults behave.
        </p>
      </Card>
      <SettingsForm
        initialValues={{
          connectorToggles: (settings.connectorToggles as Record<string, boolean>) ?? {},
          enrichmentDepth: settings.enrichmentDepth,
          complianceText:
            settings.complianceText ||
            "Lead.ai only uses public business information or user-provided data.",
          dedupeSettings: (settings.dedupeSettings as Record<string, boolean>) ?? {},
          exportDefaults: (settings.exportDefaults as Record<string, string | boolean>) ?? {}
        }}
      />
    </div>
  );
}
