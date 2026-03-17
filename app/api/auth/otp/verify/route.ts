import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { otpAuthService } from "@/modules/auth/otp-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await otpAuthService.verifyOtp(body);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          code: "invalid_request",
          message: error.issues[0]?.message ?? "Enter the 6-digit verification code."
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: "invalid_request",
        message: "We could not verify that code. Please try again."
      },
      { status: 500 }
    );
  }
}
