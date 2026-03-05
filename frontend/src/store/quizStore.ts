import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosisResult } from '../types/quiz';

interface QuizState {
  sessionToken: string | null;
  currentStep: number;
  responses: Record<string, unknown>;
  isCompleted: boolean;
  diagnosis: DiagnosisResult | null;

  startQuiz: (sessionToken: string) => void;
  saveStepResponse: (step: number, response: unknown) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeQuiz: () => void;
  setDiagnosis: (diagnosis: DiagnosisResult) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      sessionToken: null,
      currentStep: 0,
      responses: {},
      isCompleted: false,
      diagnosis: null,

      startQuiz: (sessionToken) => set({ sessionToken, currentStep: 1 }),

      saveStepResponse: (step, response) =>
        set((state) => ({
          responses: { ...state.responses, [`step_${step}`]: response },
        })),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 16) })),

      previousStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      completeQuiz: () => set({ isCompleted: true }),

      setDiagnosis: (diagnosis) => set({ diagnosis }),

      resetQuiz: () =>
        set({ sessionToken: null, currentStep: 0, responses: {}, isCompleted: false, diagnosis: null }),
    }),
    { name: 'quiz-storage' }
  )
);
