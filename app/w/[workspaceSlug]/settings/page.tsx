import { saveStudioSettingsAction } from "@/app/w/[workspaceSlug]/settings/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function SettingsPage() {
  const state = await getLocalStudioState();

  return (
    <div className="light-panel p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Studio settings</p>
      <h2 className="mt-3 font-display text-3xl text-slate-950">
        Configure the local single-user workspace.
      </h2>
      <form action={saveStudioSettingsAction} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>Studio name</Label>
          <Input name="studioName" defaultValue={state.studio.name} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" defaultValue={state.studio.description} />
        </div>
        <SubmitButton pendingLabel="Saving settings...">Save settings</SubmitButton>
      </form>
    </div>
  );
}
