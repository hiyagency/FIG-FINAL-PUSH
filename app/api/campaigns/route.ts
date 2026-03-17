import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { createCampaign } from "@/modules/lead-ai/service";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    description?: string;
    leadIds?: string[];
    searchId?: string;
  };

  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const campaign = await createCampaign(session.user.id, {
    name: body.name,
    description: body.description,
    leadIds: body.leadIds,
    searchId: body.searchId
  });

  return NextResponse.json({ id: campaign.id });
}
