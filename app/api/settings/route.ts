import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { updateSettingsData } from "@/modules/lead-ai/service";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    connectorToggles: Record<string, boolean>;
    enrichmentDepth: string;
    complianceText: string;
    dedupeSettings: Record<string, boolean>;
    exportDefaults: Record<string, string | boolean>;
  };

  const settings = await updateSettingsData(session.user.id, body);

  return NextResponse.json({ id: settings.id });
}
