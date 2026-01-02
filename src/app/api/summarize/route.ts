import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  // 1. API Key байгаа эсэхийг POST дотор шалгана. 
  // Энэ нь build-ийг алдаагүй давахад тусална.
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing");
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // 2. Client-ийг энд үүсгэнэ
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      // 3. Моделийн нэрийг зөв болгож засав (gpt-4o-mini)
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes articles clearly and concisely.",
        },
        {
          role: "user",
          content: `
            Article title: ${title}
            Article content: ${content}
            Please summarize the article in 3–5 sentences.
          `,
        },
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err: any) {
    console.error("SUMMARIZE ERROR:", err.message);
    return NextResponse.json(
      { success: false, message: "Failed to summarize: " + err.message },
      { status: 500 }
    );
  }
}