import { NextResponse } from "next/server";

import {
  enquiryEndpoint,
  enquiryPayloadSchema
} from "@/lib/enquiry-payload";

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

  const parsedPayload = enquiryPayloadSchema.safeParse(payload);

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

  try {
    const upstreamResponse = await fetch(enquiryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submission),
      cache: "no-store"
    });

    const contentType = upstreamResponse.headers.get("content-type") || "";
    let upstreamBody: Record<string, unknown> | null = null;
    let upstreamText = "";

    if (contentType.includes("application/json")) {
      upstreamBody = (await upstreamResponse.json().catch(() => null)) as
        | Record<string, unknown>
        | null;
    } else {
      upstreamText = await upstreamResponse.text().catch(() => "");

      if (upstreamText) {
        try {
          upstreamBody = JSON.parse(upstreamText) as Record<string, unknown>;
        } catch {
          upstreamBody = null;
        }
      }
    }

    const upstreamStatus =
      typeof upstreamBody?.status === "string"
        ? upstreamBody.status.toLowerCase()
        : null;
    const upstreamResult =
      typeof upstreamBody?.result === "string"
        ? upstreamBody.result.toLowerCase()
        : null;
    const upstreamSuccess =
      typeof upstreamBody?.success === "boolean" ? upstreamBody.success : null;

    if (
      !upstreamResponse.ok ||
      upstreamStatus === "error" ||
      upstreamResult === "error" ||
      upstreamSuccess === false
    ) {
      console.error("Failed to append FIG enquiry to Google Apps Script", {
        status: upstreamResponse.status,
        upstreamBody,
        upstreamText
      });

      return NextResponse.json(
        {
          message:
            "We could not submit the enquiry right now. Please call or WhatsApp FIG directly."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message:
        typeof upstreamBody?.message === "string"
          ? upstreamBody.message
          : "Your enquiry has been received. FIG will review it and connect with you soon."
    });
  } catch (error) {
    console.error("Failed to send FIG enquiry to Google Apps Script", error);

    return NextResponse.json(
      {
        message:
          "We could not submit the enquiry right now. Please call or WhatsApp FIG directly."
      },
      { status: 502 }
    );
  }
}
