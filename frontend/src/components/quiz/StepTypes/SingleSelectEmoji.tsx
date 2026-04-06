import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { track } from '../../../services/analyticsService';
import type { SelectOption } from '../../../types/quiz';

interface SingleSelectEmojiProps {
  step: number;
  question: string;
  options: SelectOption[];
  onNext: () => void;
  confirmLabel?: string;
}

export function SingleSelectEmoji({ step, question, options, onNext, confirmLabel }: SingleSelectEmojiProps) {
  const { sessionToken, saveStepResponse } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = async (value: string) => {
    track({ session_id: sessionToken ?? undefined, event_type: 'answer', screen_id: step, event_value: value });
    if (confirmLabel) {
      // With confirm button: just highlight, don't advance yet
      setSelected(value);
      saveStepResponse(step, value);
      try { await quizService.saveStep(sessionToken!, step, value); } catch { /* continue */ }
    } else {
      // Auto-advance (original behavior)
      saveStepResponse(step, value);
      try { await quizService.saveStep(sessionToken!, step, value); } catch { /* continue */ }
      setTimeout(onNext, 300);
    }
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
            className={`flex flex-col items-center gap-2 rounded-2xl p-6 border-2 transition-all duration-200 ${
              selected === opt.value
                ? 'border-gold-500 bg-gold-50 shadow-md'
                : 'bg-white border-gray-200 hover:border-gold-400 hover:bg-gold-50 hover:shadow-md'
            }`}
          >
            <span className="text-4xl">{opt.icon}</span>
            <span className="font-medium text-gray-700 text-sm">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      {confirmLabel && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: selected ? 1 : 0.4, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onNext}
          disabled={!selected}
          className="w-full btn-primary py-4 text-base mt-6 disabled:cursor-not-allowed"
        >
          {confirmLabel}
        </motion.button>
      )}
    </div>
  );
}
