import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { router, protectedProcedure } from "../trpc";
import { getStripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

function isStripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

async function getOrCreateStripeCustomer(userId: string, email: string | null) {
  const [user] = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId));

  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await getStripe().customers.create({
    metadata: { userId },
    ...(email ? { email } : {}),
  });

  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId));

  return customer.id;
}

async function getAppUrl() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export const stripeRouter = router({
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!isStripeConfigured()) {
      return { isActive: false, isConfigured: false };
    }

    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, ctx.user.id));

    if (!user?.stripeCustomerId) {
      return { isActive: false, isConfigured: true };
    }

    const subscriptions = await getStripe().subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1,
    });

    return {
      isActive: subscriptions.data.length > 0,
      isConfigured: true,
    };
  }),

  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const customerId = await getOrCreateStripeCustomer(
      ctx.user.id,
      ctx.user.email ?? null
    );

    const appUrl = await getAppUrl();

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${appUrl}/todos?checkout=success`,
      cancel_url: `${appUrl}/todos?checkout=cancel`,
    });

    if (!session.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { url: session.url };
  }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, ctx.user.id));

    if (!user?.stripeCustomerId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No billing account found. Subscribe to a plan first.",
      });
    }

    const appUrl = await getAppUrl();

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/todos`,
    });

    return { url: session.url };
  }),
});
