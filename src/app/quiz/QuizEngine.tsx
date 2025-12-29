"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

export default function QuizEngine({
  questions,
  onFinish,
}: {
  questions: Question[];
  onFinish?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = questions[index];

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onFinish?.();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold max-w-[400px]">{q.question}</h3>
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
              className={`rounded-lg border px-4 py-3 text-sm text-left
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

      <div className="mt-6 flex justify-end">
        <button
          onClick={next}
          disabled={answers[index] === undefined}
          className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-40"
        >
          {index === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </>
  );
}
