import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import type { AgeRange } from '../../../types/quiz';

const AGE_LABEL: Record<AgeRange, string> = {
  '25-34': '25 aos 34',
  '35-44': '35 aos 44',
  '45-54': '45 aos 54',
  '55+':   '55+',
};

interface TransitionAffirmationProps {
  step: number;
  onNext: () => void;
}

export function TransitionAffirmation({ onNext }: TransitionAffirmationProps) {
  const { responses } = useQuizStore();
  const ageRange = (responses.step_2 as AgeRange) ?? '35-44';
  const ageLabel = AGE_LABEL[ageRange] ?? AGE_LABEL['35-44'];

  return (
    <div className="max-w-lg mx-auto px-4 text-center relative">
      {/* Subtle golden triangle background — first visual appearance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.10 }}>
        <svg width="260" height="220" viewBox="-60 -10 360 175" xmlns="http://www.w3.org/2000/svg">
          <polygon points="120,12 210,138 30,138" fill="none" stroke="#D4A855" strokeWidth="2" />
          <circle cx="120" cy="12"  r="5" fill="#D4A855" />
          <circle cx="210" cy="138" r="5" fill="#D4A855" />
          <circle cx="30"  cy="138" r="5" fill="#D4A855" />
        </svg>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-serif text-gold-600 mb-6"
      >
        Isso não é coincidência.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-700 text-lg leading-relaxed mb-8"
      >
        Mulheres na faixa dos{' '}
        <strong className="text-gold-600">{ageLabel} anos</strong>{' '}
        frequentemente carregam um bloqueio energético que se manifesta como um ciclo: o dinheiro
        vem, cria esperança — e depois some. A boa notícia? Esse ciclo tem um padrão. E todo
        padrão pode ser mapeado.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onNext}
        className="btn-primary px-10 py-4 text-base"
      >
        Entendi →
      </motion.button>
    </div>
  );
}
