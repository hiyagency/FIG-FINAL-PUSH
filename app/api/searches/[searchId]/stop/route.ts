import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { cancelSearch } from "@/modules/lead-ai/pipeline";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ searchId: string }> }
) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchId } = await params;
  await cancelSearch(searchId, session.user.id);

  return NextResponse.json({ ok: true });
}
