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
  const { destinyNumber } = useQuizStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

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
      const t = setTimeout(onNext, 1500);
      return () => clearTimeout(t);
    }
  }, [currentStepIdx, onNext]);

  const circumference = 2 * Math.PI * 52;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a1228 50%, #0d0a18 100%)' }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-sm w-full">
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
            const done = i < currentStepIdx;
            const active = i === currentStepIdx;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentStepIdx ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm" style={{ color: done ? '#D4A855' : active ? '#fff8f0' : '#5a4a3a' }}>
                  {done ? '✓' : active ? '◉' : '○'}
                </span>
                <span className="text-sm" style={{ color: done ? '#D4A855' : active ? '#fff8f0' : '#5a4a3a' }}>
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {currentStepIdx === STEPS.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-4"
            style={{ background: 'rgba(212,168,85,0.1)', border: '1px solid rgba(212,168,85,0.3)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#D4A855' }}>
              Seu Código de Abundância foi identificado.
            </p>
            <p className="text-xs mt-1" style={{ color: '#a89070' }}>
              Número do Destino: <strong style={{ color: '#D4A855' }}>{destinyNumber ?? '—'}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
