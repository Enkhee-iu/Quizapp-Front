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
  const [finished, setFinished] = useState(false);

  // 🔹 Load quiz
  useEffect(() => {
    const raw = localStorage.getItem("currentQuiz");

    if (!raw) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { questions?: Question[] };
      if (Array.isArray(parsed.questions)) {
        setQuestions(parsed.questions);
      }
    } catch (err) {
      console.error("Invalid quiz data", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  // 🔹 Redirect if no quiz
  useEffect(() => {
    if (!loaded) return;
    if (questions.length === 0) {
      router.replace("/");
    }
  }, [loaded, questions, router]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quiz...
      </div>
    );
  }

  if (finished) {
    const score = questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correctIndex ? 1 : 0);
    }, 0);

    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-6 rounded-xl w-[420px] text-center">
          <h2 className="text-xl font-semibold mb-2">🎉 Quiz Finished</h2>
          <p className="text-zinc-600 mb-4">
            Your score: <b>{score}</b> / {questions.length}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("currentQuiz");
              router.push("/");
            }}
            className="px-4 py-2 rounded-md bg-black text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // 🔥 CRASH-оос хамгаалалт
  const q = questions[index];
  if (!q) return null;

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
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
            onClick={() => {
              localStorage.removeItem("currentQuiz");
              router.push("/");
            }}
            className="w-8 h-8 rounded-md border flex items-center justify-center text-zinc-500"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold max-w-[420px]">
            {q.question}
          </h3>
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
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [index]: oi }))
                }
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
