import { EmptyState } from "@/components/ui/empty-state";

export default function AdminPage() {
  return (
    <EmptyState
      title="Admin metrics are hidden in single-user mode"
      description="This local-private build is focused on one operator, so there is no separate tenant admin surface. Infrastructure health can be inspected from logs and the local process status instead."
    />
  );
}
