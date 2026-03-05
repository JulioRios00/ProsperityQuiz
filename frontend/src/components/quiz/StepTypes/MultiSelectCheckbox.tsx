import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import type { SelectOption } from '../../../types/quiz';

interface MultiSelectCheckboxProps {
  step: number;
  question: string;
  subtitle?: string;
  options: SelectOption[];
  onNext: () => void;
}

export function MultiSelectCheckbox({ step, question, subtitle, options, onNext }: MultiSelectCheckboxProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { sessionToken, saveStepResponse } = useQuizStore();

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleContinue = async () => {
    if (selected.length < 2) return;
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
        <p className="text-center text-gray-400 text-sm mb-6">{subtitle}</p>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt.value);
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggle(opt.value)}
              className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left border transition-all duration-200 ${
                isSelected
                  ? 'bg-gold-50 border-gold-400 text-gold-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gold-300'
              }`}
            >
              <span className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'bg-gold-500 border-gold-500' : 'border-gray-300'
              }`}>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </span>
              <span className="font-medium text-sm">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selected.length >= 2 ? 1 : 0.4 }}
        onClick={handleContinue}
        disabled={selected.length < 2 || loading}
        className="mt-6 w-full btn-primary py-4 text-base disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Continuar →'}
      </motion.button>
    </div>
  );
}
