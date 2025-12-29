"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

export default function QuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Load quiz from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("currentQuiz");
    if (!raw) {
      router.push("/");
      return;
    }
    const data = JSON.parse(raw);
    setQuestions(data.questions || []);
  }, [router]);

  if (questions.length === 0) return null;

  const q = questions[index];

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.push("/"); // дараа нь result page болгож болно
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-[560px] bg-white rounded-xl border shadow-sm p-6">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              ✨ Quick test
            </div>
            <p className="text-sm text-zinc-500">
              Take a quick test about your knowledge from your content
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-md border flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>

        {/* QUESTION */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold max-w-[420px]">
            {q.question}
          </h2>

          <span className="text-sm text-zinc-500">
            {index + 1} / {questions.length}
          </span>
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, oi) => {
            const selected = answers[index] === oi;

            return (
              <button
                key={oi}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [index]: oi,
                  }))
                }
                className={`rounded-lg border px-4 py-3 text-sm text-left transition
                  ${
                    selected
                      ? "border-black bg-zinc-100 font-medium"
                      : "hover:bg-zinc-50"
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6">
          <button
            onClick={next}
            disabled={answers[index] === undefined}
            className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-40"
          >
            {index === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
