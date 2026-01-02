"use client";

import { ButtonSecondary } from "@/components/ui/btn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type HistoryItem = {
  id: string;
  title: string;
  summary?: string;
  questions?: Question[];
};

export default function HistoryViewer() {
  const router = useRouter();
  const [item, setItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const quizId = ""; // quiz deer darah uyd avna

  const load = () => {
    try {
      const raw = localStorage.getItem("selectedHistory");
      if (!raw) return;

      const parsed: HistoryItem = JSON.parse(raw);

      console.log("VIEWER ITEM ", parsed);

      setItem(parsed);
    } catch (err) {
      console.error("Failed to parse selectedHistory", err);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("history-select", load);
    return () => window.removeEventListener("history-select", load);
  }, []);

  if (!item) return null;

  const handleTakeQuiz = async () => {
    setIsLoading(true);

    if (item.questions && item.questions.length > 0) {
      localStorage.setItem(
        "currentQuiz",
        JSON.stringify({ questions: item.questions })
      );
      router.push("/quiz");
      return;
    }

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          content: item.summary, // Backend 'content' гэж хүлээж авч байгаа
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        throw new Error("Сервер алдаа заалаа");
      }

      const data = await res.json();
      // data нь одоо шууд { questions: [...] } ирнэ

      localStorage.setItem("currentQuiz", JSON.stringify(data));
      router.push("/quiz");
    } catch (err) {
      console.error("Алдаа:", err);
      alert("AI асуулт бэлдэж чадсангүй.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setItem(null);
    localStorage.removeItem("selectedHistory");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white max-w-xl w-full rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">{item.title}</h2>

        {item.summary && (
          <p className="text-sm text-zinc-700 whitespace-pre-line">
            {item.summary}
          </p>
        )}

        <div className="mt-4 flex justify-between">
          <ButtonSecondary
            className="cursor-pointer"
            onClick={handleTakeQuiz}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Loading...
              </span>
            ) : (
              "Take quiz"
            )}
          </ButtonSecondary>

          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded cursor-pointer bg-zinc-800 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
