import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Params = {
  params: { id: string };
};

export async function POST(req: Request, { params }: Params) {
  try {
    // 1️⃣ Auth
    const userId = await requireUser();

    // 2️⃣ Article шалгах
    const article = await prisma.article.findFirst({
      where: {
        id: params.id,
        userId,
      },
      select: {
        summary: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // 3️⃣ Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 4️⃣ PROMPT (маш энгийн)
    const prompt = `
Create 3 multiple choice questions from this summary.
Return ONLY JSON like this:

{
  "questions": [
    {
      "question": "text",
      "options": ["A","B","C","D"],
      "correct": "A"
    }
  ]
}

Summary:
${article.summary}
`;

    // 5️⃣ AI дуудна
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("AI RAW RESPONSE:", text);
    // 6️⃣ JSON цэвэрлэж parse хийнэ
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);

    const quiz = JSON.parse(json);

    // 7️⃣ Түр хариу (DB-д хадгалахгүй)
    return NextResponse.json({
      message: "AI quiz generated",
      quiz,
    });
  } catch (error) {
    console.error("QUIZ AI ERROR:", error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
