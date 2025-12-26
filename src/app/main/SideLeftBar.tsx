"use client";
import { useState } from "react";
import SideBarIcon from "../icons/sidebar";

type HistoryItem = {
  id: string;
  title: string;
};

export default function SideLeftBar({ onClose }: { onClose: () => void }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

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
          {historyItems.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
