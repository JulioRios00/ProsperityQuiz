import { QuizFlow } from './QuizFlow';
import { quizConfigB } from '../config/quizConfigB';

export function QuizFlowB() {
  return <QuizFlow config={quizConfigB} returnPath="/b" />;
}
