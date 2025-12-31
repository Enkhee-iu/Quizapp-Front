import { NextResponse } from "next/server";

const quizzes: Record<string, any> = {
  "593d7dbd-dfd9-432f-9ccc-2ac05ca31d90": {
    // Таны хайж буй ID
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
    ],
  },
};

// ⚠️ params-ийг заавал авна

// ... (quizzes object хэвээрээ байна)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Энд Promise гэж тодорхойлно
) {
  // 2. params-ийг await хийж авна
  const resolvedParams = await params;
  const id = resolvedParams.id;

  console.log("WORKING API QUIZ ID ", id);

  const quiz = quizzes[id];

  if (!quiz) {
    return NextResponse.json(
      { error: "Quiz not found", searchedId: id },
      { status: 404 }
    );
  }

  return NextResponse.json(quiz);
}
