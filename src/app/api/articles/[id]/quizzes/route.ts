import { NextRequest, NextResponse } from "next/server"; // NextRequest ашиглах нь тохиромжтой
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Next.js 15 дээр params нь Promise байна
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // 1️⃣ Params-ийг await хийж авна (Next.js 15-ын гол шаардлага)
    const { id: articleId } = await context.params;

    // 2️⃣ Auth
    const userId = await requireUser();

    // 3️⃣ Article шалгах
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: userId,
      },
      select: {
        summary: true,
      },
    });

    if (!article || !article.summary) {
      return NextResponse.json({ error: "Article not found or summary empty" }, { status: 404 });
    }

    // 4️⃣ Gemini model тохируулах
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Gemini-д JSON буцаахыг хүчээр зааж өгөх
    });

    // 5️⃣ PROMPT
    const prompt = `
      Create 3 multiple choice questions from this summary.
      Return ONLY a JSON object with this structure:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correct": "string"
          }
        ]
      }
      Summary: ${article.summary}
    `;

    // 6️⃣ AI-аас хариу авах
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 7️⃣ JSON Parse хийх (найдвартай арга)
    try {
      // Заримдаа AI хариунд ```json ... ``` нэмчихдэг тул цэвэрлэх
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const quiz = JSON.parse(cleanJson);

      return NextResponse.json({
        message: "AI quiz generated",
        quiz,
      });
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

  } catch (error) {
    console.error("QUIZ AI ERROR:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}