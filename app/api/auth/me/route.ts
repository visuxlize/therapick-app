import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/session";
import { getTokenFromCookies } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
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

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        location: user.location,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
