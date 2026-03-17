import Stripe from "stripe";

import { env } from "@/lib/env";

let stripe: Stripe | null = null;

function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }

  if (!stripe) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripe;
}

export const planCatalog = {
  FREE: { name: "Free", seats: 1 },
  STARTER: { name: "Starter", seats: 3, priceId: env.STRIPE_PRICE_STARTER },
  GROWTH: { name: "Growth", seats: 10, priceId: env.STRIPE_PRICE_GROWTH },
  AGENCY: { name: "Agency", seats: 30, priceId: env.STRIPE_PRICE_AGENCY }
} as const;

export async function createCheckoutSession(input: {
  workspaceId: string;
  plan: keyof typeof planCatalog;
  successUrl: string;
  cancelUrl: string;
}) {
  const client = getStripe();
  const plan = planCatalog[input.plan];

  if (!client || !plan || !("priceId" in plan) || !plan.priceId) {
    throw new Error("Stripe is not configured for the requested plan.");
  }

  return client.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: plan.priceId,
        quantity: 1
      }
    ],
    metadata: {
      workspaceId: input.workspaceId,
      plan: input.plan
    },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl
  });
}
