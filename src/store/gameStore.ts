import { create } from 'zustand';

export type Language = 'en' | 'ar';
export type AudienceType = 'kids' | 'adults';
export type Category = 'food' | 'sweets' | 'culture' | 'history' | 'spices' | 'religion' | 'mixed';
export type QuestionType = 'standard' | 'flipCard' | 'trueFalse' | 'speedRound';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact?: string;
  type: QuestionType;
  timeLimit?: number; // for speed round
}

interface GameState {
  language: Language | null;
  audience: AudienceType | null;
  category: Category | null;
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  totalAnswered: number;
  isLoading: boolean;
  gameStarted: boolean;

  // Actions
  setLanguage: (lang: Language) => void;
  setAudience: (audience: AudienceType) => void;
  setCategory: (category: Category | null) => void;
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  startGame: () => void;
  resetGame: () => void;
  setLoading: (loading: boolean) => void;
  newCategory: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  language: null,
  audience: null,
  category: null,
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  totalAnswered: 0,
  isLoading: false,
  gameStarted: false,

  setLanguage: (language) => set({ language }),
  setAudience: (audience) => set({ audience }),
  setCategory: (category) => set({ category }),
  setQuestions: (questions) => set({ questions }),
  answerQuestion: (isCorrect) => set((state) => ({
    score: isCorrect ? state.score + 1 : state.score,
    totalAnswered: state.totalAnswered + 1,
  })),
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1,
  })),
  startGame: () => set({ gameStarted: true }),
  resetGame: () => set({
    language: null,
    audience: null,
    category: null,
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    totalAnswered: 0,
    isLoading: false,
    gameStarted: false,
  }),
  setLoading: (isLoading) => set({ isLoading }),
  newCategory: () => set({
    category: null,
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    totalAnswered: 0,
    isLoading: false,
    gameStarted: false,
  }),
}));
