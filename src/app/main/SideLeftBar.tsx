"use client";

import { useEffect, useState } from "react";
import SideBarIcon from "../icons/sidebar";

type HistoryItem = {
  id: string;
  title: string;
  summary?: string;
  score?: number;
  total?: number;
};

export default function SideLeftBar({ onClose }: { onClose: () => void }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // ✅ Sidebar нээгдэхэд history ачаална
  useEffect(() => {
    const raw = localStorage.getItem("history");
    if (raw) {
      setHistoryItems(JSON.parse(raw));
    }
  }, []);

  return (
    <aside className="fixed left-5 top-16 h-[calc(100vh-3.5rem)] w-75 border-r border-zinc-200 bg-white">
      <div className="h-full px-3 py-2 flex flex-col">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xl font-semibold leading-7 tracking-[-0.025em]">
            History
          </span>

          <button
            onClick={onClose}
            className="p-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            <SideBarIcon />
          </button>
        </div>

        {/* Scroll area */}
        <ul className="flex-1 overflow-y-auto space-y-1">
          {historyItems.length === 0 && (
            <li className="px-2 py-1 text-sm text-zinc-400">
              No history yet
            </li>
          )}

          {historyItems.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
              onClick={() => {
                // OPTIONAL: тухайн quiz-ийг дахин нээх
                localStorage.setItem(
                  "currentQuiz",
                  JSON.stringify(item)
                );
                window.location.href = "/quiz";
              }}
            >
              <div className="font-medium">{item.title}</div>

              {item.score !== undefined && (
                <div className="text-xs text-zinc-500">
                  Score: {item.score}/{item.total}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
