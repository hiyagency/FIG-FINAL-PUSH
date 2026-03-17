import { EmptyState } from "@/components/ui/empty-state";

export default function BillingPage() {
  return (
    <EmptyState
      title="Billing is disabled in local-private mode"
      description="This installation is configured for a single private individual running REEL.ai locally, so account creation, subscription management, and overage billing are intentionally out of the active workflow."
    />
  );
}
