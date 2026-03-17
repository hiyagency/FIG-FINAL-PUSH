import { EmptyState } from "@/components/ui/empty-state";
import { getBrandDnaCompletionScore, getLocalStudioState } from "@/modules/local-studio/store";

export default async function QuestionnairePage() {
  const state = await getLocalStudioState();
  const completion = getBrandDnaCompletionScore(state);

  return (
    <EmptyState
      title="Questionnaire adapts to your Brand DNA and project context"
      description={
        completion === 0
          ? "Set up your Brand DNA first. Once real projects exist, the questionnaire will only ask for the missing inputs that were not already implied by your saved voice, audience, and style preferences."
          : "Your Brand DNA is partially configured. Upload media and open a project to let REEL.ai ask only the few remaining questions needed for generation."
      }
    />
  );
}
