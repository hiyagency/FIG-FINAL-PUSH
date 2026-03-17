import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { otpAuthService } from "@/modules/auth/otp-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await otpAuthService.resendOtp(body);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          code: "invalid_email",
          message: error.issues[0]?.message ?? "Enter a valid email address."
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: "failed_to_send_otp",
        message: "We could not send another code. Please try again."
      },
      { status: 500 }
    );
  }
}
