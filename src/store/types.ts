export type Entry = {
  id: string;
  title: string;
  date: string;
  category: string;
  philosophy: string;
  situation: string;
  learned: string;
  action: string;
  notes: string;
  important: boolean;
};
export type Decision = {
  id: string;
  date: string;
  category: string;
  situation: string;
  values: string[];
  urgency: string;
  options: string[];
  selected: string;
  philosophy: string;
  next: string;
};
export type Session = {
  id: string;
  date: string;
  type: string;
  seconds: number;
  answers: string[];
  feeling: string;
};
export type State = {
  onboarded: boolean;
  saved: string[];
  viewed: { id: string; date: string }[];
  practiced: { id: string; date: string }[];
  completed: string[];
  lessonSteps: Record<string, number>;
  quizResults: Record<string, { score: number; answers: number[] }>;
  entries: Entry[];
  decisions: Decision[];
  sessions: Session[];
  comparisons: {
    id: string;
    earlier: string;
    current: string;
    text: string;
    date: string;
  }[];
};
