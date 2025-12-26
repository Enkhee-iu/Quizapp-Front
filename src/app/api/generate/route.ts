import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
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
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    }
  ]
}

Article:
"""
${text}
"""
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      throw new Error("Empty AI response");
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(cleaned);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("QUIZ GENERATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
