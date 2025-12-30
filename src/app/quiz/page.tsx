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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("currentQuiz");
    if (!raw) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        questions?: Question[];
      };

      setQuestions(Array.isArray(parsed.questions) ? parsed.questions : []);
    } catch (err) {
      console.error("Invalid quiz data", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    if (questions.length === 0) {
      router.push("/");
    }
  }, [loaded, questions, router]);

  if (questions.length === 0) return null;

  const q = questions[index];

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-[560px] bg-white rounded-xl border shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">✨ Quick test</h2>
            <p className="text-sm text-zinc-500">
              Take a quick test about your knowledge
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-md border flex items-center justify-center text-zinc-500"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold max-w-[420px]">{q.question}</h3>
          <span className="text-sm text-zinc-500">
            {index + 1}/{questions.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, oi) => {
            const selected = answers[index] === oi;
            return (
              <button
                key={oi}
                onClick={() => setAnswers((prev) => ({ ...prev, [index]: oi }))}
                className={`rounded-lg border px-4 py-3 text-left
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

        <div className="flex justify-end mt-6">
          <button
            onClick={next}
            disabled={answers[index] === undefined}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-40"
          >
            {index === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
