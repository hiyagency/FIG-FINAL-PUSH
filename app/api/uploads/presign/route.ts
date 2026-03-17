import { NextResponse } from "next/server";

import { createUploadReservation } from "@/modules/uploads/service";

export async function POST(request: Request) {
  const body = await request.json();
  const reservation = await createUploadReservation(body);

  return NextResponse.json(reservation);
}
