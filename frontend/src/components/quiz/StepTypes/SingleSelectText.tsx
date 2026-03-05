import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import type { SelectOption } from '../../../types/quiz';

interface SingleSelectTextProps {
  step: number;
  question: string;
  options: SelectOption[];
  onNext: () => void;
}

export function SingleSelectText({ step, question, options, onNext }: SingleSelectTextProps) {
  const { sessionToken, saveStepResponse } = useQuizStore();

  const handleSelect = async (value: string) => {
    saveStepResponse(step, value);
    try {
      await quizService.saveStep(sessionToken!, step, value);
    } catch {
      // continue
    }
    setTimeout(onNext, 300);
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 text-center mb-8"
      >
        {question}
      </motion.h2>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-center font-medium text-gray-700 hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 hover:shadow-md transition-all duration-200"
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
