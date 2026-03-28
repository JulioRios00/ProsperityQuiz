import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosisResult } from '../types/quiz';

interface QuizState {
  sessionToken: string | null;
  currentStep: number;
  responses: Record<string, unknown>;
  isCompleted: boolean;
  diagnosis: DiagnosisResult | null;
  // User personal data for numerology
  userName: string | null;
  userBirthDate: string | null;
  destinyNumber: number | null;
  expressionNumber: number | null;
  prosperityBlock: number | null;
  // Palmistry
  palmistrySkipped: boolean;
  palmistryPhotoUrl: string | null;

  startQuiz: (sessionToken: string) => void;
  saveStepResponse: (step: number, response: unknown) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeQuiz: () => void;
  setDiagnosis: (diagnosis: DiagnosisResult) => void;
  setUserData: (name: string, birthDate: string, destinyNumber: number, expressionNumber: number, prosperityBlock: number) => void;
  setPalmistrySkipped: (skipped: boolean) => void;
  setPalmistryPhoto: (url: string | null) => void;
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
      userName: null,
      userBirthDate: null,
      destinyNumber: null,
      expressionNumber: null,
      prosperityBlock: null,
      palmistrySkipped: false,
      palmistryPhotoUrl: null,

      startQuiz: (sessionToken) => set({ sessionToken, currentStep: 1 }),

      saveStepResponse: (step, response) =>
        set((state) => ({
          responses: { ...state.responses, [`step_${step}`]: response },
        })),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 17) })),

      previousStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      completeQuiz: () => set({ isCompleted: true }),

      setDiagnosis: (diagnosis) => set({ diagnosis }),

      setUserData: (name, birthDate, destinyNumber, expressionNumber, prosperityBlock) =>
        set({ userName: name, userBirthDate: birthDate, destinyNumber, expressionNumber, prosperityBlock }),

      setPalmistrySkipped: (skipped) => set({ palmistrySkipped: skipped }),

      setPalmistryPhoto: (url) => set({ palmistryPhotoUrl: url }),

      resetQuiz: () =>
        set({
          sessionToken: null,
          currentStep: 0,
          responses: {},
          isCompleted: false,
          diagnosis: null,
          userName: null,
          userBirthDate: null,
          destinyNumber: null,
          expressionNumber: null,
          prosperityBlock: null,
          palmistrySkipped: false,
          palmistryPhotoUrl: null,
        }),
    }),
    { name: 'quiz-storage' }
  )
);
