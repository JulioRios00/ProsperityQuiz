import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import type { SelectOption } from '../../../types/quiz';

interface SingleSelectEmojiProps {
  step: number;
  question: string;
  options: SelectOption[];
  onNext: () => void;
}

export function SingleSelectEmoji({ step, question, options, onNext }: SingleSelectEmojiProps) {
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

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.value)}
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-6 hover:border-gold-400 hover:bg-gold-50 hover:shadow-md transition-all duration-200"
          >
            <span className="text-4xl">{opt.icon}</span>
            <span className="font-medium text-gray-700 text-sm">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
