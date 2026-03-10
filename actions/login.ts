"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getAuthUser } from "@/lib/supabase/server";

export async function login() {
  try {
    const { user, error: authError } = await getAuthUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    // Only create if user doesn't exist
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: user.id,
        email: user.email,
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error syncing user to public table:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync user",
    };
  }
}
