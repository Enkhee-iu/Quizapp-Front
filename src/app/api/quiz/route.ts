import { NextResponse } from "next/server";
import OpenAI from "openai";

// 1. Client-ийг global биш, функц дотор эсвэл дуудагдах үед нь үүсгэх нь аюулгүй
export async function POST(req: Request) {
  // Build үед эсвэл Runtime үед Key байхгүй бол алдааг энд барина
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not defined");
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { title, content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a quiz generator. Based on the article titled "${title || "Untitled"}", generate EXACTLY 5 multiple-choice questions.
      Strict JSON format:
      {
        "questions": [
          { "question": "string", "options": ["string", "string", "string", "string"], "correctIndex": number }
        ]
      }
      Article: """${content}"""
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      // 2. OpenAI-д заавал JSON буцаахыг үүрэг болгох (илүү найдвартай)
      response_format: { type: "json_object" } 
    });

    const raw = completion.choices[0].message.content;
    
    if (!raw) throw new Error("AI returned empty content");

    // response_format: json_object ашиглаж байгаа үед AI илүү дутуу 
    // ```json тэмдэглэгээ хийхгүй цэвэр JSON ирүүлдэг
    const quiz = JSON.parse(raw);

    return NextResponse.json(quiz);
  } catch (error: any) {
    console.error("QUIZ GENERATE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" }, 
      { status: 500 }
    );
  }
}