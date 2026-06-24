import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Lightweight diagnostic: checks that the app can reach the database and that
 * the expected tables exist. Visit /api/health in the browser.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const users = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      database: "connected",
      userCount: users,
    });
  } catch (err) {
    const e = err as { name?: string; message?: string; code?: string };
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        name: e.name,
        code: e.code,
        message: e.message?.slice(0, 500),
      },
      { status: 500 }
    );
  }
}
