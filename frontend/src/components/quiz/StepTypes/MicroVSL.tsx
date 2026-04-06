import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { AUTHORITY_IMAGE_URL, AUTHORITY_NAME } from '../../../config/authorityImage';

interface MicroVSLProps {
  step: number;
  onNext: () => void;
}

export function MicroVSL({ onNext }: MicroVSLProps) {
  const { userName, destinyNumber } = useQuizStore();
  const firstName = userName ? userName.trim().split(' ')[0] : null;

  return (
    <div className="max-w-sm mx-auto px-4 pb-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-gold-500 font-medium uppercase tracking-wide mb-4"
      >
        Uma mensagem especial para você
      </motion.p>

      {/* VSL video — 9:16 vertical, max-width 400px */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto rounded-2xl overflow-hidden mb-6 shadow-xl"
        style={{ aspectRatio: '9/16', maxWidth: 360, background: '#0a0a14' }}
      >
        {/* TODO: replace with actual video embed — autoplay muted, unmute on click */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <img
            src={AUTHORITY_IMAGE_URL}
            alt={AUTHORITY_NAME}
            className="w-24 h-24 rounded-full object-cover object-top border-2 border-gold-400"
          />
          <p className="text-sm leading-relaxed" style={{ color: '#e8d5a8' }}>
            "Acabei de ver seu diagnóstico
            {firstName ? `, ${firstName}` : ''}. Seu padrão é
            surpreendentemente claro. Pessoas com o Número{' '}
            <strong style={{ color: '#D4A855' }}>{destinyNumber ?? '?'}</strong>{' '}
            estão a UMA decisão de destravar tudo."
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onNext}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg"
      >
        Continuar meu diagnóstico →
      </motion.button>
    </div>
  );
}
