"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Input2 } from "@/components/ui/input2";
import { ButtonSecondary } from "@/components/ui/btn";

import PaperIcon from "../icons/PaperIcon";
import StarIcon from "../icons/staricon";

const MainPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("Article content is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Artificial Intelligence is transforming the world. It helps automate tasks, improve decision-making, and enable new products.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log("SUMMARY:", data.summary);
    } catch (err) {
      console.error(err);
      alert("Gemini error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full h-110.5 rounded-lg border p-7">
      {/* Header */}
      <div className="flex items-center gap-2">
        <StarIcon />
        <h3 className="text-2xl font-semibold text-black">
          Article Quiz Generator
        </h3>
      </div>

      <p className="mt-2 text-base leading-[1.2] text-[#71717A]">
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      {/* Title */}
      <div className="mt-5 flex items-center gap-2">
        <PaperIcon />
        <p className="text-sm font-semibold text-[#71717A]">Article Title</p>
      </div>
      <Input
        className="mt-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter article title"
      />

      {/* Content */}
      <div className="mt-5 flex items-center gap-2">
        <PaperIcon />
        <p className="text-sm font-semibold text-[#71717A]">Article Content</p>
      </div>
      <Input2
        className="mt-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your article content here..."
      />

      {/* Button */}
      <div className="mt-4 flex justify-end">
        <ButtonSecondary onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate summary"}
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default MainPage;
