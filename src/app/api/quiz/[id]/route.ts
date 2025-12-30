import { NextResponse } from "next/server";

const quizzes: Record<string, any> = {
  "e729aa13-ca9f-41f6-b73d-d0dfb993089c": {
    questions: [
      {
        question: "What does FIFA stand for?",
        options: [
          "International Football Federation",
          "Fédération Internationale de Football Association",
          "Federation of International Football Athletes",
          "Football International Federation",
        ],
        correctIndex: 1,
      },
      {
        question: "Where is FIFA headquartered?",
        options: ["Paris", "Zurich", "London", "Rome"],
        correctIndex: 1,
      },
    ],
  },
};

export async function GET(req: Request) {
  // 🔥 URL-ээс ID-г шууд гаргаж авна
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log("API QUIZ ID (URL) 👉", id);

  if (!id) {
    return NextResponse.json(
      { error: "Missing quiz id" },
      { status: 400 }
    );
  }

  const quiz = quizzes[id];

  if (!quiz) {
    return NextResponse.json(
      { error: "Quiz not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(quiz);
}
