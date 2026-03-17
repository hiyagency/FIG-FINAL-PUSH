import { WorkspaceRole } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { hasRequiredRole } from "@/modules/common/rbac";

describe("hasRequiredRole", () => {
  it("allows higher roles to access lower-permission actions", () => {
    expect(hasRequiredRole(WorkspaceRole.OWNER, WorkspaceRole.EDITOR)).toBe(true);
  });

  it("rejects lower roles for elevated actions", () => {
    expect(hasRequiredRole(WorkspaceRole.VIEWER, WorkspaceRole.ADMIN)).toBe(false);
  });
});
