"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StarIcon from "../icons/staricon";
import { CheckCircle2, XCircle, RotateCcw, Bookmark } from "lucide-react";

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
  const [showExitModal, setShowExitModal] = useState(false);

  // Quiz-ийг ачаалах
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
      console.error("Quiz өгөгдөл уншихад алдаа гарлаа", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Өгөгдөлгүй бол буцаах
  useEffect(() => {
    if (loaded && questions.length === 0) {
      router.replace("/");
    }
  }, [loaded, questions, router]);

  if (!loaded)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-inter text-zinc-400 animate-pulse">
        Loading quiz...
      </div>
    );

  const currentQuestion = questions[index];

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  // --- ҮР ДҮНГИЙН ХЭСЭГ ---
  if (finished) {
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );

    return (
      <div className="min-h-screen flex flex-col items-center pt-20 bg-zinc-50 pb-20 font-inter px-4">
        <div className="w-full max-w-125">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <StarIcon />
              <h1 className="text-[24px] font-semibold tracking-[-0.025em]">
                Quiz completed
              </h1>
            </div>
            <p className="text-[#71717A] text-lg">
              Let&apos;s see what you did
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-[24px] shadow-sm">
            <h2 className="font-sans font-semibold text-[32px] leading-8 text-center mb-8">
              Your score: {score}{" "}
              <span className="text-zinc-400">/ {questions.length}</span>
            </h2>

            <div className="space-y-8 max-h-112.5 overflow-y-auto pr-2 custom-scrollbar">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex;
                return (
                  <div
                    key={i}
                    className="flex gap-4 border-b border-zinc-50 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="mt-1 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="text-green-500 w-6 h-6" />
                      ) : (
                        <XCircle className="text-red-500 w-6 h-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 font-medium leading-tight">
                        {i + 1}. {q.question}
                      </p>
                      <p className="text-zinc-900 font-semibold">
                        Your answer: {q.options[answers[i]] || "No answer"}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-500 font-semibold text-sm">
                          Correct: {q.options[q.correctIndex]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-zinc-200 rounded-xl font-semibold hover:bg-zinc-50 transition-all active:scale-95"
              >
                <RotateCcw size={18} /> Restart quiz
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#18181b] text-white rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-95"
              >
                <Bookmark size={18} /> Save and leave
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex pt-20 justify-center bg-zinc-50 font-inter px-4 relative">
      <div className="max-w-150 w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex gap-2 items-center text-[24px] leading-8 tracking-[-0.025em]">
              <StarIcon />
              <h2 className="font-semibold">Quick test</h2>
            </div>
            <p className="text-base text-[#71717A] font-medium mt-1">
              Take a quick test about your knowledge
            </p>
          </div>
          <button
            onClick={() => setShowExitModal(true)}
            className="w-10 h-10 bg-white cursor-pointer hover:bg-zinc-100 rounded-md border flex items-center justify-center text-zinc-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg max-w-105 leading-relaxed text-zinc-900">
              {currentQuestion.question}
            </h3>
            <span className="text-sm font-medium text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full shrink-0">
              {index + 1} / {questions.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, oi) => {
              const isSelected = answers[index] === oi;
              return (
                <button
                  key={oi}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [index]: oi }))
                  }
                  className={`rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-black bg-zinc-50 font-semibold"
                      : "border-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "text-zinc-400 border-zinc-200"
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={handleNext}
              disabled={answers[index] === undefined}
              className="px-8 py-3 rounded-xl cursor-pointer bg-[#18181b] text-white font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {index === questions.length - 1 ? "Finish quiz" : "Next question"}
            </button>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] p-8 max-w-100 w-full shadow-2xl">
            <h2 className="text-[24px] font-bold tracking-tight text-center mb-2">
              Are you sure?
            </h2>
            <p className="text-[#71717A] text-center mb-8 text-sm">
              If you press &apos;Cancel&apos;, this quiz will be closed and your
              progress will be lost.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-4 cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold transition-all active:scale-95"
              >
                Go back
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("currentQuiz");
                  router.push("/");
                }}
                className="w-full py-4 cursor-pointer bg-[#18181b] text-white rounded-xl font-bold transition-all active:scale-95 hover:bg-zinc-800"
              >
                Cancel quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
