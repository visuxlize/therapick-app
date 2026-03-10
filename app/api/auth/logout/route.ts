import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import { getTokenFromCookies } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookies(req.headers.get("cookie"));

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
