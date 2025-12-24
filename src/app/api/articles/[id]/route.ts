import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  try {
    // 🔐 Auth
    const userId = await requireUser();

    // 📦 DB query
    const article = await prisma.article.findFirst({
      where: {
        id: params.id,
        userId, // 🔒 user-owned only
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

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
