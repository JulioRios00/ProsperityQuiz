import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { track } from '../../../services/analyticsService';
import type { SelectOption } from '../../../types/quiz';

interface SingleSelectTextProps {
  step: number;
  question: string;
  options: SelectOption[];
  onNext: () => void;
  variant?: string;
}

const BINARY_COLORS = [
  'border-green-400 bg-green-50 text-green-800 hover:border-green-500 hover:bg-green-100',
  'border-red-400 bg-red-50 text-red-800 hover:border-red-500 hover:bg-red-100',
];

export function SingleSelectText({ step, question, options, onNext, variant }: SingleSelectTextProps) {
  const { sessionToken, saveStepResponse } = useQuizStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  const handleSelect = async (value: string) => {
    if (inFlightRef.current || isSubmitting) return;
    inFlightRef.current = true;
    setIsSubmitting(true);

    saveStepResponse(step, value);
    track({ session_id: sessionToken ?? undefined, event_type: 'answer', screen_id: step, event_value: value });
    try {
      await quizService.saveStep(sessionToken!, step, value);
    } catch {
      // continue
    }
    onNext();
  };

  const isBinary = variant === 'binary';

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
            disabled={isSubmitting}
            className={`w-full border-2 rounded-xl px-6 py-5 text-center font-semibold text-base transition-all duration-200 ${
              isBinary
                ? BINARY_COLORS[i] ?? BINARY_COLORS[0]
                : 'bg-white border-gray-200 text-gray-700 hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 hover:shadow-md'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
