import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import type { BlockedArea } from '../../../types/quiz';

interface PivotContent {
  hook: string;
  text: string;
  highlight: string;
}

const PIVOTS: Record<BlockedArea, PivotContent> = {
  financeiro: {
    hook: 'A boa notícia: existe uma saída precisa.',
    text: 'Esse padrão tem uma causa específica — e uma solução precisa. Não é uma questão de "trabalhar mais" ou "querer mais". É uma questão de timing e alinhamento vibracional.',
    highlight: 'Mulheres que conhecem o padrão e agem na janela certa transformam sua relação com o dinheiro em semanas, não anos.',
  },
  relacionamentos: {
    hook: 'A boa notícia: padrões podem ser reescritos.',
    text: 'Relacionamentos saudáveis não são sorte — são o resultado de um alinhamento interno. Quando você trata o bloqueio na raiz, os vínculos que você sempre quis começam a aparecer.',
    highlight: 'Mulheres que trabalham o bloqueio relacional relatam mudanças profundas nas conexões em menos de 30 dias.',
  },
  saude: {
    hook: 'A boa notícia: seu corpo quer se curar.',
    text: 'Vitalidade não é um privilégio — é seu estado natural. Quando o campo energético é realinhado, o corpo responde com uma velocidade surpreendente.',
    highlight: 'O realinhamento correto pode restaurar energia e disposição de formas que anos de tratamentos convencionais não conseguiram.',
  },
  proposito: {
    hook: 'A boa notícia: seu momento chegou.',
    text: 'Propósito não é encontrado — é destravado. Você já tem dentro de si tudo o que precisa. O que falta é remover o que impede você de aparecer plenamente.',
    highlight: 'Quando o bloqueio de propósito é tratado, clareza e ação surgem naturalmente — sem forçar, sem fingir.',
  },
};

interface PivotProps {
  step: number;
  onNext: () => void;
}

export function Pivot({ onNext }: PivotProps) {
  const { responses } = useQuizStore();
  const blockedArea = (responses.step_2 as BlockedArea) ?? 'financeiro';
  const content = PIVOTS[blockedArea] ?? PIVOTS['financeiro'];

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <span className="text-5xl">🌟</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 mb-5"
      >
        {content.hook}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 text-lg leading-relaxed mb-6"
      >
        {content.text}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gold-50 border border-gold-200 rounded-xl p-5 mb-8"
      >
        <p className="text-gold-800 font-medium leading-relaxed">{content.highlight}</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="btn-primary px-10 py-4 text-base"
      >
        Quero saber mais →
      </motion.button>
    </div>
  );
}
