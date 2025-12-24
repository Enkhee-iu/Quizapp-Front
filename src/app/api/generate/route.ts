import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 🔐 Auth
    const userId = requireUser();

    // 📥 Request body
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // 🤖 Gemini summarize
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(
      `Summarize the following article in clear bullet points:\n\n${text}`
    );

    const summary = result.response.text();

    // 💾 Save to DB
    const article = await prisma.article.create({
      data: {
        userId,
        originalText: text,
        summary,
      },
    });

    // ✅ Response
    return NextResponse.json({
      articleId: article.id,
      summary,
    });
  } catch (error: unknown) {
    console.error("GENERATE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
