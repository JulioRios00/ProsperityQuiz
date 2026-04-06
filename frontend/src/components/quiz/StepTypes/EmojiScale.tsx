import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { track } from '../../../services/analyticsService';

interface EmojiScaleProps {
  step: number;
  question: string;
  subtitle?: string;
  onNext: () => void;
}

const SCALE_EMOJIS = ['😐', '🤔', '😕', '😣', '🔮'];
const SCALE_LABELS = ['Nada', 'Pouco', 'Moderado', 'Muito', 'Totalmente'];

export function EmojiScale({ step, question, subtitle, onNext }: EmojiScaleProps) {
  const { sessionToken, saveStepResponse } = useQuizStore();

  const handleSelect = async (value: number) => {
    saveStepResponse(step, value);
    track({ session_id: sessionToken ?? undefined, event_type: 'answer', screen_id: step, event_value: value });
    try {
      await quizService.saveStep(sessionToken!, step, value);
    } catch {
      // continue
    }
    setTimeout(onNext, 350);
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
          return (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(value)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gold-400 hover:bg-gold-50 hover:scale-110 transition-all duration-200 w-[4.5rem]"
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs font-medium text-gray-400">{SCALE_LABELS[i]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
