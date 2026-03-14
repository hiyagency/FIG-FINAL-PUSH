import { headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  MissingGoogleSheetsConfigError,
  appendEnquiryToSheet
} from "@/lib/google-sheets";
import { contactFormSchema } from "@/lib/contact-form-schema";
import { getSiteUrl } from "@/lib/fig-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Unable to read the enquiry payload." },
      { status: 400 }
    );
  }

  const parsedPayload = contactFormSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        message: "Please review the form details and try again.",
        fieldErrors: parsedPayload.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const submission = parsedPayload.data;

  if (submission.website) {
    return NextResponse.json(
      { message: "Unable to process this enquiry." },
      { status: 400 }
    );
  }

  const requestHeaders = await headers();
  const sourcePage =
    submission.sourcePage?.trim() ||
    requestHeaders.get("referer") ||
    `${getSiteUrl()}/`;
  const userAgent = requestHeaders.get("user-agent") || "Unavailable";

  try {
    await appendEnquiryToSheet({
      timestamp: new Date().toISOString(),
      fullName: submission.fullName,
      phoneNumber: submission.phoneNumber,
      emailAddress: submission.emailAddress,
      investmentAmount: submission.investmentAmount,
      message: submission.message,
      sourcePage,
      userAgent
    });

    return NextResponse.json({
      message:
        "Your enquiry has been received. FIG will review it and connect with you soon."
    });
  } catch (error) {
    if (error instanceof MissingGoogleSheetsConfigError) {
      console.error("Google Sheets configuration missing for FIG enquiries", error);

      return NextResponse.json(
        {
          message:
            "The enquiry form is temporarily unavailable. Please call or WhatsApp FIG directly."
        },
        { status: 503 }
      );
    }

    console.error("Failed to append FIG enquiry to Google Sheets", error);

    return NextResponse.json(
      {
        message:
          "We could not submit the enquiry right now. Please call or WhatsApp FIG directly."
      },
      { status: 500 }
    );
  }
}
