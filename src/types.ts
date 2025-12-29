export type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type HistoryItem = {
  id: string;
  title: string;
  summary?: string;
  score?: number;
  total?: number;
};
