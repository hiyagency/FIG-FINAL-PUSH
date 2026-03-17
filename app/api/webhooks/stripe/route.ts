import { NextResponse } from "next/server";
import Stripe from "stripe";

import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook integration is not configured." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    return NextResponse.json({
      received: true,
      type: event.type
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid signature."
      },
      { status: 400 }
    );
  }
}
