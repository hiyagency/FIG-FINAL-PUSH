import { randomBytes } from "node:crypto";

export function createReviewLinkToken() {
  return randomBytes(24).toString("base64url");
}

export function buildApprovalSummary(input: {
  variantName: string;
  requestedBy: string;
  notes?: string;
}) {
  return `${input.requestedBy} requested approval for ${input.variantName}.${input.notes ? ` Notes: ${input.notes}` : ""}`;
}
