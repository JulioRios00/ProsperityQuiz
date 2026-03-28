import { QuizFlow } from './QuizFlow';
import { quizConfigA } from '../config/quizConfigA';

export function QuizFlowA() {
  return <QuizFlow config={quizConfigA} returnPath="/a" />;
}
