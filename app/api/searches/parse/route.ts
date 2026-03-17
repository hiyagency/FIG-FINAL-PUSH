import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { parseSearchIntent } from "@/modules/lead-ai/service";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rawPrompt?: string };

  if (!body.rawPrompt) {
    return NextResponse.json({ error: "rawPrompt is required" }, { status: 400 });
  }

  const intent = await parseSearchIntent(body.rawPrompt);

  return NextResponse.json({ intent });
}
