import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import type { AgeRange } from '../../../types/quiz';

interface StatisticContent {
  stat: string;
  text: string;
  source: string;
}

const STATISTICS: Record<AgeRange, StatisticContent> = {
  '25-34': {
    stat: '78%',
    text: 'das mulheres entre 25 e 34 anos relatam sentir que "algo as impede" de atingir seu potencial — mesmo trabalhando tanto quanto todos ao redor.',
    source: 'Pesquisa Vibracional 2025 — 4.200 participantes',
  },
  '35-44': {
    stat: '83%',
    text: 'das mulheres entre 35 e 44 anos identificam ao menos um padrão de autossabotagem repetitivo que acompanha sua vida há mais de 5 anos.',
    source: 'Pesquisa Vibracional 2025 — 4.200 participantes',
  },
  '45-54': {
    stat: '71%',
    text: 'das mulheres entre 45 e 54 anos sentem uma força invisível que as puxa de volta para o mesmo nível toda vez que tentam avançar.',
    source: 'Pesquisa Vibracional 2025 — 4.200 participantes',
  },
  '55+': {
    stat: '67%',
    text: 'das mulheres acima de 55 anos acreditam estar abaixo do que merecem — e identificam um bloqueio específico como a causa principal.',
    source: 'Pesquisa Vibracional 2025 — 4.200 participantes',
  },
};

interface TransitionStatisticProps {
  step: number;
  onNext: () => void;
}

export function TransitionStatistic({ onNext }: TransitionStatisticProps) {
  const { responses } = useQuizStore();
  const ageRange = (responses.step_1 as AgeRange) ?? '35-44';
  const content = STATISTICS[ageRange] ?? STATISTICS['35-44'];

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="text-8xl font-serif font-bold text-gold-500">{content.stat}</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-700 leading-relaxed mb-4"
      >
        {content.text}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-gray-400 mb-10"
      >
        {content.source}
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
