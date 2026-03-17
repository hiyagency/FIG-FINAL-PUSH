import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import type { ParsedSearchIntent } from "@/modules/lead-ai/contracts";
import { createSearch } from "@/modules/lead-ai/service";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    rawPrompt?: string;
    intent?: ParsedSearchIntent;
  };

  if (!body.rawPrompt) {
    return NextResponse.json({ error: "rawPrompt is required" }, { status: 400 });
  }

  const search = await createSearch(session.user.id, {
    rawPrompt: body.rawPrompt,
    intent: body.intent
  });

  return NextResponse.json({
    searchId: search.id,
    status: search.status
  });
}
