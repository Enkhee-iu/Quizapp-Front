import { NextResponse } from "next/server";
import OpenAI from "openai";

// 🛠 1. Instance-ийг POST дотор эсвэл хамгаалалттай үүсгэх
// Ингэснээр API KEY байхгүй үед build шууд гацахаас сэргийлнэ
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Build үед алдаа гаргахгүй, харин ажиллах үед (runtime) алдааг мэдээлнэ
    return null;
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      console.error("OPENAI_API_KEY is missing in environment variables");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `
You are a quiz generator.
Based on the article below, generate EXACTLY 5 multiple-choice questions.
Rules:
- Each question must have 4 options
- Only 1 option is correct
- Output MUST be valid JSON
- Do NOT include explanations
- Use this JSON format strictly:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number
    }
  ]
}

Article:
"""
${text}
"""
`;

    // 🛠 2. Моделийн нэрийг зассан: gpt-4o-mini
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" } // OpenAI-д JSON буцаахыг шууд зааж өгөх
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      throw new Error("Empty AI response");
    }

    const quiz = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      message: "Quiz generated successfully",
      data: quiz,
    });
  } catch (error: any) {
    console.error("QUIZ GENERATE ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to generate quiz: " + error.message },
      { status: 500 }
    );
  }
}