import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

export async function requireAdmin(_req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return {
        error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
      };
    }

    const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
    const role = (sessionClaims?.role as string | undefined) ?? publicMetadata?.role ?? "CUSTOMER";

    if (!ADMIN_ROLES.has(role)) {
      return {
        error: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
      };
    }

    return { uid: userId, role };
  } catch (err) {
    console.error("[admin-guard] Failed to verify admin session:", err);
    return {
      error: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
    };
  }
}
