import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';

interface Props {
  onNext: () => void;
}

const STEPS = [
  'Identificando Linha do Destino Financeiro...',
  'Medindo comprimento da Linha de Abundância...',
  'Analisando interseção com Linha do Bloqueio...',
  'Cruzando com seu Número do Destino...',
  'Diagnóstico Palm-Numerológico completo! ✨',
];

export function PalmistryAnalysis({ onNext }: Props) {
  const { destinyNumber, expressionNumber, palmistryPhotoUrl } = useQuizStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const total = STEPS.length;
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < total - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(Math.round(((currentStepIdx + 1) / STEPS.length) * 100));
  }, [currentStepIdx]);

  useEffect(() => {
    if (currentStepIdx === STEPS.length - 1) {
      const t = setTimeout(() => setDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [currentStepIdx]);

  const circumference = 2 * Math.PI * 52;

  // Personalized palm result based on destiny + expression numbers
  const codeNumber = destinyNumber && expressionNumber
    ? ((destinyNumber * 3 + expressionNumber * 7) % 9) + 1
    : destinyNumber ?? 7;

  const PALM_LABELS = ['', 'Abertura', 'Expansão', 'Transformação', 'Abundância', 'Renovação', 'Fluxo', 'Manifestação', 'Desbloqueio', 'Prosperidade'];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a1228 50%, #0d0a18 100%)' }}
    >
      {/* Hand photo as background (30% opacity, blur) */}
      {palmistryPhotoUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${palmistryPhotoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            filter: 'blur(8px)',
          }}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-sm w-full relative z-10">
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: '#D4A855' }}>
          Análise Palm-Numerológica
        </p>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(212,168,85,0.15)" strokeWidth="4" />
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="#D4A855"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <span className="absolute text-2xl font-bold" style={{ color: '#D4A855' }}>{progress}%</span>
        </div>

        {/* Steps list */}
        <div className="space-y-3 mb-8 text-left">
          {STEPS.map((s, i) => {
            const label = i === 3 ? s.replace('...', ` (${destinyNumber ?? '?'})...`) : s;
            const isDone = i < currentStepIdx;
            const isActive = i === currentStepIdx;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentStepIdx ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm" style={{ color: isDone ? '#D4A855' : isActive ? '#fff8f0' : '#5a4a3a' }}>
                  {isDone ? '✓' : isActive ? '◉' : '○'}
                </span>
                <span className="text-sm" style={{ color: isDone ? '#D4A855' : isActive ? '#fff8f0' : '#5a4a3a' }}>
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Result card + CTA — shown after analysis completes */}
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: 'rgba(212,168,85,0.1)', border: '1px solid rgba(212,168,85,0.3)' }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: '#D4A855' }}>
                Seu Código de Abundância foi revelado
              </p>
              <p className="text-xs mb-1" style={{ color: '#a89070' }}>
                Código Palm-Numerológico:{' '}
                <strong style={{ color: '#D4A855', fontSize: '1.1rem' }}>{codeNumber}</strong>
              </p>
              <p className="text-xs" style={{ color: '#a89070' }}>
                Vibração predominante:{' '}
                <strong style={{ color: '#D4A855' }}>{PALM_LABELS[codeNumber] ?? 'Abundância'}</strong>
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              className="w-full py-4 text-base font-bold rounded-xl"
              style={{ background: '#D4A855', color: '#0a0a14' }}
            >
              Ver Diagnóstico →
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
