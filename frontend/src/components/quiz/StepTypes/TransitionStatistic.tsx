import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import type { AgeRange } from '../../../types/quiz';

const AGE_LABEL: Record<AgeRange, string> = {
  '25-34': '25 aos 34',
  '35-44': '35 aos 44',
  '45-54': '45 aos 54',
  '55+':   '55+',
};

interface TransitionStatisticProps {
  step: number;
  onNext: () => void;
}

export function TransitionStatistic({ onNext }: TransitionStatisticProps) {
  const { responses } = useQuizStore();
  const ageRange = (responses.step_2 as AgeRange) ?? '35-44';
  const ageLabel = AGE_LABEL[ageRange] ?? AGE_LABEL['35-44'];

  return (
    <div className="max-w-lg mx-auto px-4 text-center relative">
      {/* Subtle constellation icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,20 180,160 20,160" fill="none" stroke="#C8963E" strokeWidth="2" />
          <circle cx="100" cy="20"  r="5" fill="#C8963E" />
          <circle cx="180" cy="160" r="5" fill="#C8963E" />
          <circle cx="20"  cy="160" r="5" fill="#C8963E" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <span
          className="font-serif font-bold text-gold-500"
          style={{ fontSize: '48px', lineHeight: 1.1, color: '#C8963E' }}
        >
          +3.847
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-700 leading-relaxed mb-4"
      >
        mulheres na faixa dos{' '}
        <strong className="text-gold-600">{ageLabel} anos</strong>{' '}
        já identificaram seu padrão de bloqueio.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-600 leading-relaxed mb-10"
      >
        87% relataram mudanças financeiras reais nas primeiras 4 semanas após descobrir{' '}
        <strong>QUANDO</strong> agir.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="btn-primary px-10 py-4 text-base"
      >
        Continuar →
      </motion.button>
    </div>
  );
}
