import { WorkspaceRole } from "@prisma/client";

const workspaceRoleWeight: Record<WorkspaceRole, number> = {
  OWNER: 100,
  ADMIN: 90,
  STRATEGIST: 70,
  EDITOR: 60,
  APPROVER: 50,
  VIEWER: 10
};

export function hasRequiredRole(
  actual: WorkspaceRole,
  minimum: WorkspaceRole = WorkspaceRole.VIEWER
) {
  return workspaceRoleWeight[actual] >= workspaceRoleWeight[minimum];
}
