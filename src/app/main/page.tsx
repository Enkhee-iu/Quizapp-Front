"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Input2 } from "@/components/ui/input2";
import { ButtonSecondary } from "@/components/ui/btn";
import HistoryViewer from "../_components/HistoryViewer";
import PaperIcon from "../icons/PaperIcon";
import StarIcon from "../icons/staricon";

export default function MainPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<"input" | "summary">("input");

const handleSummarize = async () => {
  if (!title.trim()) {
    alert("Article title is required");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Write a concise article about: ${title}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setSummary(data.summary);
    setMode("summary");

    const newItem = {
      id: crypto.randomUUID(),
      title: title,
      summary: data.summary,
    };

    const prev = JSON.parse(localStorage.getItem("history") || "[]");

    localStorage.setItem(
      "history",
      JSON.stringify([newItem, ...prev])
    );

  } catch (err) {
    console.error("SUMMARIZE ERROR:", err);
    alert("Summarize error");
  } finally {
    setLoading(false);
  }
};

  const handleTakeQuiz = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem(
        "currentQuiz",
        JSON.stringify({
          title,
          summary,
          questions: data.data.questions,
        })
      );

      router.push("/quiz");
    } catch (err) {
      console.error("QUIZ ERROR:", err);
      alert("Quiz generate error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full rounded-lg border bg-white p-7">
      <div className="flex items-center gap-2">
        <StarIcon />
        <h3 className="text-2xl font-semibold">
          Article Quiz Generator
        </h3>
      </div>

      <p className="mt-2 text-sm text-zinc-500">
        Paste your article below to generate a summary and then take a quick quiz.
      </p>

      <div className="mt-6 flex items-center gap-2">
        <PaperIcon />
        <p className="text-sm font-semibold text-zinc-600">
          Article Title
        </p>
      </div>

      <Input
        className="mt-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter article title"
      />

       <div className="mt-5 flex items-center gap-2">
            <PaperIcon />
            <p className="text-sm font-semibold text-zinc-600">
              Article Content
            </p>
          </div>
      {mode === "input" && (
        <>
         

          <Input2
            className="mt-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
          />
        </>
      )}

      {mode === "summary" && summary && (
        <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
          <p className="text-xs font-semibold text-zinc-500 mb-1">
            Summary
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {mode === "input" && (
          <ButtonSecondary onClick={handleSummarize} disabled={loading}>
            {loading ? "Generating..." : "Generate summary"}
          </ButtonSecondary>
        )}

        {mode === "summary" && (
          <>
           

            <ButtonSecondary onClick={handleTakeQuiz} disabled={loading}>
             {loading ? "Thinking..." : "Take quiz"} 
            </ButtonSecondary>
          </>
        )}
      </div>
      <HistoryViewer/>
    </div>
  );
}
