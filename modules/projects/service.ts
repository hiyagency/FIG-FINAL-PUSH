import { ProjectStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getWorkspaceDashboard(workspaceId: string) {
  const [projects, publishJobs, analyticsSnapshots, templates, threads] =
    await Promise.all([
      prisma.project.findMany({
        where: { workspaceId },
        include: {
          brand: true,
          variants: true,
          currentVersion: true
        },
        orderBy: { updatedAt: "desc" },
        take: 6
      }),
      prisma.publishJob.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 6
      }),
      prisma.analyticsSnapshot.findMany({
        where: { workspaceId },
        orderBy: { capturedAt: "desc" },
        take: 20
      }),
      prisma.template.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 6
      }),
      prisma.engagementThread.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 6
      })
    ]);

  const activeProjects = projects.filter(
    (project) =>
      project.status !== ProjectStatus.ARCHIVED &&
      project.status !== ProjectStatus.FAILED
  );

  const totalViews = analyticsSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.views,
    0
  );

  return {
    activeProjects,
    publishJobs,
    templates,
    threads,
    analytics: {
      totalViews,
      totalPosts: publishJobs.filter((job) => job.status === "PUBLISHED").length,
      avgViewsPerPost:
        publishJobs.length > 0 ? Math.round(totalViews / publishJobs.length) : 0
    }
  };
}
