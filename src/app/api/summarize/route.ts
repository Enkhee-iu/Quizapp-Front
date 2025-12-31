import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes articles clearly and concisely.",
        },
        {
          role: "user",
          content: `
Article title:
${title}

Article content:
${content}

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
  } catch (err) {
    console.error("SUMMARIZE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to summarize" },
      { status: 500 }
    );
  }
}
