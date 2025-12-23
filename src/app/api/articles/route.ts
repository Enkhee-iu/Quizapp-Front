import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/auth";

export async function GET() {
  try {
    // 🔐 Auth (Clerk)
    const userId = await requireUser();

    // 📦 DB query
    const articles = await prisma.article.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        summary: true,
        createdAt: true,
      },
    });

    // ✅ Response
    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
