import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { success: false, message: "Text is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the following article in 3-5 sentences.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err) {
    console.error("SUMMARIZE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to summarize" },
      { status: 500 }
    );
  }
}
