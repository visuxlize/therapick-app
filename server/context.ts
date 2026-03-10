import { cache } from "react";
import { getAuthUser } from "@/lib/supabase/server";
import { headers } from "next/headers";

export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  const { supabase, user, error } = await getAuthUser();
  let userAgent: string | undefined;
  if (opts?.req) {
    userAgent = opts.req.headers.get("user-agent") ?? undefined;
  } else {
    const h = await headers();
    userAgent = h.get("user-agent") ?? undefined;
  }
  return {
    supabase,
    user: error ? null : user,
    userAgent,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
