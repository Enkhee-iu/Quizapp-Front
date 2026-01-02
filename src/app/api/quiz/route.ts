import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // 1. ХУВЬСАГЧИЙГ ЗАСАВ: Frontend-ээс 'content' нэрээр ирж байгаа
    const { title, content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a quiz generator. Based on the article titled "${title}", generate EXACTLY 5 multiple-choice questions.
      Strict JSON format:
      {
        "questions": [
          { "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0 }
        ]
      }
      Article: """${content}"""
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // 2. МОДЕЛИЙН НЭРИЙГ ЗАСАВ
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw!
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const quiz = JSON.parse(cleaned);

    // 3. БҮТЦИЙГ ЗАСАВ: Шууд quiz-ийг буцаавал Frontend-д хялбар
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("QUIZ GENERATE ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
