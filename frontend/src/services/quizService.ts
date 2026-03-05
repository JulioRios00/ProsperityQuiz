import api from './api';
import type { DiagnosisResult } from '../types/quiz';

export const quizService = {
  async startQuiz(): Promise<{ session_token: string; quiz_id: string }> {
    const { data } = await api.post('/quiz/start');
    return data;
  },

  async saveStep(sessionToken: string, step: number, response: unknown) {
    const { data } = await api.post('/quiz/step', {
      session_token: sessionToken,
      step,
      response,
    });
    return data;
  },

  async generateDiagnosis(sessionToken: string): Promise<DiagnosisResult> {
    const { data } = await api.post('/diagnosis/generate', {
      session_token: sessionToken,
    });
    return data;
  },

  async captureEmail(email: string, sessionToken: string, quizData?: Record<string, unknown>) {
    const { data } = await api.post('/diagnosis/capture-email', {
      email,
      session_token: sessionToken,
      quiz_data: quizData,
    });
    return data;
  },
};
