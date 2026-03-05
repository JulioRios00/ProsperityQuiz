import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import type { BlockedArea } from '../../../types/quiz';

interface AffirmationContent {
  title: string;
  text: string;
  quote?: string;
}

// Step 7 — reassurance: validates the user's struggle
const REASSURANCES: Record<BlockedArea, AffirmationContent> = {
  financeiro: {
    title: 'Isso não é falta de esforço.',
    text: 'O bloqueio financeiro não é fraqueza nem incompetência. É um padrão energético herdado que precisa ser tratado na origem — não apenas na superfície. Nenhuma técnica de finanças vai resolver o que é uma questão vibracional.',
    quote: '"A prosperidade começa por dentro."',
  },
  relacionamentos: {
    title: 'Você não está condenada a esse ciclo.',
    text: 'O padrão nos relacionamentos não é o seu destino. É uma programação que pode ser reescrita quando você entende onde ela começou. Amor genuíno é algo para o qual você está completamente pronta.',
    quote: '"Conexão verdadeira começa com você."',
  },
  saude: {
    title: 'Seu corpo está pedindo por você.',
    text: 'A desconexão entre mente e corpo não é fraqueza — é um sinal de que algo precisa ser realinhado em um nível mais profundo. Seu corpo não está contra você. Ele está tentando se comunicar.',
    quote: '"Vitalidade é seu estado natural."',
  },
  proposito: {
    title: 'Você já nasceu para isso.',
    text: 'A sensação de não estar vivendo seu propósito não é uma falha de caráter. É o resultado de um bloqueio que impede você de aparecer da forma que realmente é. O mundo precisa do que só você tem.',
    quote: '"Seu impacto está esperando por você."',
  },
};

interface TransitionAffirmationProps {
  step: number;
  onNext: () => void;
}

export function TransitionAffirmation({ onNext }: TransitionAffirmationProps) {
  const { responses } = useQuizStore();
  const blockedArea = (responses.step_2 as BlockedArea) ?? 'financeiro';
  const content = REASSURANCES[blockedArea] ?? REASSURANCES['financeiro'];

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <span className="text-4xl">✦</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 mb-6"
      >
        {content.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 text-lg leading-relaxed mb-6"
      >
        {content.text}
      </motion.p>

      {content.quote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gold-500 italic text-sm mb-8"
        >
          {content.quote}
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="btn-primary px-10 py-4 text-base"
      >
        Entendi, continuar →
      </motion.button>
    </div>
  );
}
