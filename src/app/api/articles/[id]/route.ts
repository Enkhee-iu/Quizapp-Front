import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

// 1️⃣ Next.js 15-д params нь Promise байх ёстой
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // 2️⃣ params-ийг await хийж утгыг нь гаргаж авна
    const { id: articleId } = await context.params;

    // 🔐 Auth
    const userId = await requireUser();

    // 📦 DB query
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: userId, // 🔒 Зөвхөн тухайн хэрэглэгчийнх
      },
      select: {
        id: true,
        originalText: true,
        summary: true,
        createdAt: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // ✅ Response
    return NextResponse.json(article);
  } catch (error: unknown) {
    console.error("GET /api/articles/:id ERROR:", error);

    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 401 });
  }
}
