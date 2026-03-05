import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { AUTHORITY_IMAGE_URL } from '../../../config/authorityImage';

const AREA_LABELS: Record<string, string> = {
  financeiro: 'Prosperidade Financeira',
  relacionamentos: 'Relacionamentos',
  saude: 'Saúde e Vitalidade',
  proposito: 'Propósito e Missão',
};

const BLOCKAGE_LEVEL_LABELS: Record<number, string> = {
  1: 'Inicial',
  2: 'Moderado',
  3: 'Significativo',
  4: 'Intenso',
  5: 'Crítico',
};

interface ResultPageProps {
  step: number;
  onNext: () => void;
}

export function ResultPage({ onNext }: ResultPageProps) {
  const { diagnosis } = useQuizStore();

  // Preload the authority image so it's cached before MicroVSL renders
  useEffect(() => {
    const img = new Image();
    img.src = AUTHORITY_IMAGE_URL;
  }, []);

  if (!diagnosis) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p>Carregando diagnóstico...</p>
      </div>
    );
  }

  const areaLabel = AREA_LABELS[diagnosis.blocked_area] ?? diagnosis.blocked_area;
  const levelLabel = BLOCKAGE_LEVEL_LABELS[diagnosis.blockage_level] ?? String(diagnosis.blockage_level);
  const paragraphs = diagnosis.diagnosis_text.split('\n\n');

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">🔮</span>
        <h2 className="text-2xl md:text-3xl font-serif text-gold-600 mt-3 mb-1">
          Seu Diagnóstico Tridimensional
        </h2>
        <p className="text-gray-400 text-sm">Gerado especialmente para você</p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Área Principal</p>
          <p className="font-semibold text-gold-600 text-sm">{areaLabel}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Nível do Bloqueio</p>
          <p className="font-semibold text-gold-600 text-sm">{levelLabel}</p>
        </div>
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Dias Favoráveis</p>
          <p className="font-bold text-gold-700 text-xl">{diagnosis.favorable_days}</p>
        </div>
      </motion.div>

      {/* Diagnosis text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6"
      >
        {paragraphs.map((para, i) => (
          <p key={i} className={`text-gray-700 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>
            {para}
          </p>
        ))}
      </motion.div>

      {/* Favorable days callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gold-500 to-gold-400 rounded-2xl p-5 text-white text-center mb-8"
      >
        <p className="text-sm opacity-90 mb-1">Sua janela vibracional</p>
        <p className="text-2xl font-bold mb-1">{diagnosis.favorable_days} dias</p>
        <p className="text-sm opacity-80">para destravar seu potencial</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="w-full btn-primary py-4 text-base"
      >
        Ver como agir nessa janela →
      </motion.button>
    </div>
  );
}
