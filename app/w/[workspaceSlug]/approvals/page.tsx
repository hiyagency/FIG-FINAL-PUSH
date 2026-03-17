import { EmptyState } from "@/components/ui/empty-state";

export default function ApprovalsPage() {
  return (
    <EmptyState
      title="No approvals requested yet"
      description="This local-private studio no longer shows seeded approval traffic. Approval requests will appear here only after you create real review links and collect comments."
    />
  );
}
