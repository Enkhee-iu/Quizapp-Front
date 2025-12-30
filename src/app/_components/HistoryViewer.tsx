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

  const load = () => {
    const raw = localStorage.getItem("selectedHistory");
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log("VIEWER ITEM 👉", parsed);
      console.log("VIEWER QUESTIONS 👉", parsed.questions);
      setItem(parsed);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("history-select", load);
    return () => window.removeEventListener("history-select", load);
  }, []);

  if (!item) return null;

const handleTakeQuiz = () => {
  router.push(`/quiz?historyId=${item.id}`);
};


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white max-w-xl w-full rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">
          {item.title}
        </h2>

        <p className="text-sm text-zinc-700 whitespace-pre-line">
          {item.summary}
        </p>

        <div className="mt-4 flex justify-between">
          <ButtonSecondary onClick={handleTakeQuiz}>
            Take quiz
          </ButtonSecondary>

          <button
            onClick={() => {
              setItem(null);
              localStorage.removeItem("selectedHistory");
            }}
            className="px-4 py-1.5 rounded bg-zinc-800 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
