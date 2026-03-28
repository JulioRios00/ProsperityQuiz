import type { QuizStepConfig } from '../types/quiz';
import { quizConfigA } from './quizConfigA';

// Variant B — identical to A for now.
// Diverge here when running the A/B test.
export const quizConfigB: QuizStepConfig[] = [...quizConfigA];
