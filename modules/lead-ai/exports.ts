import { promises as fs } from "node:fs";
import path from "node:path";

import * as XLSX from "xlsx";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { slugify } from "@/modules/lead-ai/helpers";

function toCsvValue(value: unknown) {
  if (value == null) {
    return "";
  }

  const stringValue = Array.isArray(value) ? value.join("; ") : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function buildRows(leads: Array<Record<string, unknown>>) {
  const headers = [
    "Company",
    "Contact",
    "Role",
    "Email",
    "Phone",
    "Website",
    "Location",
    "Opportunity Score",
    "Fit Score",
    "Confidence Score",
    "Pain Points",
    "Outreach Angle",
    "Sources"
  ];

  const rows = leads.map((lead) => [
    lead.companyName,
    lead.contactName,
    lead.contactRole,
    lead.businessEmail,
    lead.businessPhone,
    lead.website,
    [lead.city, lead.state, lead.country].filter(Boolean).join(", "),
    lead.opportunityScore,
    lead.fitScore,
    lead.confidenceScore,
    Array.isArray(lead.painPoints) ? lead.painPoints.join("; ") : "",
    lead.outreachAngle,
    Array.isArray(lead.sourceUrls) ? lead.sourceUrls.join("; ") : ""
  ]);

  return { headers, rows };
}

async function resolveExportLeads(exportId: string) {
  const exportRecord = await prisma.export.findUnique({
    where: { id: exportId },
    include: {
      search: {
        include: {
          searchLeads: {
            orderBy: { rank: "asc" },
            include: { lead: true }
          }
        }
      },
      campaign: {
        include: {
          leads: {
            include: { lead: true }
          }
        }
      },
      list: {
        include: {
          leads: {
            include: { lead: true }
          }
        }
      }
    }
  });

  if (!exportRecord) {
    throw new Error(`Export ${exportId} not found`);
  }

  if (exportRecord.search) {
    return {
      exportRecord,
      leads: exportRecord.search.searchLeads.map((item) => item.lead)
    };
  }

  if (exportRecord.campaign) {
    return {
      exportRecord,
      leads: exportRecord.campaign.leads.map((item) => item.lead)
    };
  }

  if (exportRecord.list) {
    return {
      exportRecord,
      leads: exportRecord.list.leads.map((item) => item.lead)
    };
  }

  return {
    exportRecord,
    leads: []
  };
}

export async function runExportJob(exportId: string) {
  await prisma.export.update({
    where: { id: exportId },
    data: {
      status: "RUNNING"
    }
  });

  const { exportRecord, leads } = await resolveExportLeads(exportId);
  const exportDir = path.resolve(process.cwd(), env.LEAD_AI_EXPORT_DIR);
  await fs.mkdir(exportDir, { recursive: true });

  const fileBaseName = slugify(exportRecord.fileName.replace(/\.[a-z0-9]+$/i, "")) || exportId;
  const filePath = path.join(
    exportDir,
    `${fileBaseName}.${exportRecord.format === "XLSX" ? "xlsx" : "csv"}`
  );

  const { headers, rows } = buildRows(leads);

  if (exportRecord.format === "CSV") {
    const csv = [headers.map(toCsvValue).join(","), ...rows.map((row) => row.map(toCsvValue).join(","))].join(
      "\n"
    );
    await fs.writeFile(filePath, csv, "utf8");
  } else {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, filePath);
  }

  await prisma.export.update({
    where: { id: exportId },
    data: {
      status: "COMPLETE",
      rowCount: leads.length,
      storageKey: filePath,
      completedAt: new Date()
    }
  });

  return filePath;
}
