import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';

interface EmojiScaleProps {
  step: number;
  question: string;
  subtitle?: string;
  onNext: () => void;
}

const SCALE_EMOJIS = ['😐', '😕', '😟', '😔', '😩'];
const SCALE_LABELS = ['Leve', 'Moderado', 'Significativo', 'Intenso', 'Crítico'];

export function EmojiScale({ step, question, subtitle, onNext }: EmojiScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { sessionToken, saveStepResponse } = useQuizStore();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    saveStepResponse(step, selected);
    try {
      await quizService.saveStep(sessionToken!, step, selected);
    } catch {
      // continue
    }
    setLoading(false);
    onNext();
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
        <p className="text-center text-gray-400 text-sm mb-8">{subtitle}</p>
      )}

      <div className="flex justify-center gap-3 mt-8">
        {SCALE_EMOJIS.map((emoji, i) => {
          const value = i + 1;
          const isSelected = selected === value;
          return (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 w-20 ${
                isSelected
                  ? 'border-gold-400 bg-gold-50 scale-110'
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-gold-700' : 'text-gray-400'}`}>
                {SCALE_LABELS[i]}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.4 }}
        onClick={handleContinue}
        disabled={!selected || loading}
        className="mt-8 w-full btn-primary py-4 text-base disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Continuar →'}
      </motion.button>
    </div>
  );
}
