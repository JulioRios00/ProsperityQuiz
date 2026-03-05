import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import type { SelectOption } from '../../../types/quiz';

interface SingleSelectCardProps {
  step: number;
  question: string;
  subtitle?: string;
  options: SelectOption[];
  onNext: () => void;
}

export function SingleSelectCard({ step, question, subtitle, options, onNext }: SingleSelectCardProps) {
  const { sessionToken, saveStepResponse } = useQuizStore();

  const handleSelect = async (value: string) => {
    saveStepResponse(step, value);
    try {
      await quizService.saveStep(sessionToken!, step, value);
    } catch {
      // continue — local state is saved
    }
    setTimeout(onNext, 300);
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 text-center mb-2"
      >
        {question}
      </motion.h2>
      {subtitle && (
        <p className="text-center text-gray-500 text-sm mb-6">{subtitle}</p>
      )}

      <div className="flex flex-col gap-3 mt-6">
        {options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.value)}
            className="group flex items-center gap-4 w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-left shadow-sm hover:border-gold-400 hover:shadow-md hover:bg-gold-50 transition-all duration-200"
          >
            {opt.icon && (
              <span className="text-2xl w-8 text-center flex-shrink-0">{opt.icon}</span>
            )}
            <div>
              <p className="font-medium text-gray-800 group-hover:text-gold-700">{opt.label}</p>
              {opt.description && (
                <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
