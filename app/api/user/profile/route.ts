import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserFromToken } from "@/lib/auth/session";
import { getTokenFromCookies } from "@/lib/auth/jwt";
import { updateProfileSchema } from "@/lib/validations/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromCookies(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const [updatedUser] = await db
      .update(users)
      .set({
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.location !== undefined && { location: validatedData.location }),
        ...(validatedData.preferences !== undefined && { preferences: validatedData.preferences }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        location: updatedUser.location,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
