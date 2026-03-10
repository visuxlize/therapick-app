import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { waitlistUsers } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email/templates";

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const waitlistRouter = router({
  getCount: publicProcedure.query(async () => {
    const [row] = await db
      .select({ value: count() })
      .from(waitlistUsers);
    return { count: row?.value ?? 0 };
  }),

  join: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        email: z.string().email("Please enter a valid email"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(waitlistUsers)
        .where(eq(waitlistUsers.email, input.email))
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already registered",
        });
      }

      const [countResult] = await db
        .select({ value: count() })
        .from(waitlistUsers);
      const position = (countResult?.value ?? 0) + 1;
      const referralCode = generateReferralCode();

      const [user] = await db
        .insert(waitlistUsers)
        .values({
          email: input.email,
          name: input.name ?? null,
          referralCode,
          position,
          metadata: {
            source: "landing_page",
            userAgent: ctx.userAgent,
          },
        })
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join waitlist",
        });
      }

      await sendWelcomeEmail({
        email: user.email,
        name: user.name ?? "there",
        position: user.position,
        referralCode: user.referralCode,
      });

      return {
        email: user.email,
        position: user.position,
        referralCode: user.referralCode,
      };
    }),
});
