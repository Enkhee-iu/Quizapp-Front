"use client";

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

export default function HistoryCard({ item }: { item: HistoryItem }) {
console.log(item.questions);
  // 🔥 ЭНЭ Л ХАМГИЙН ЧУХАЛ ФУНКЦ
  const openHistory = () => {
    console.log("CARD ITEM 👉", item);
    console.log("CARD QUESTIONS 👉", item.questions);

    localStorage.setItem(
      "selectedHistory",
      JSON.stringify({
        id: item.id,
        title: item.title,
        summary: item.summary,
        questions: item.questions, // 🔥 ХЭРВЭЭ ЭНД undefined БОЛ — BACKEND АСУУДАЛ
      })
    );

    window.dispatchEvent(new Event("history-select"));
  };

  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={openHistory}>View</button>
    </div>
  );
}
