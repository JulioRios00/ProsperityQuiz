import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS_TEXT = [
  'Analisando seu perfil vibracional...',
  'Calculando seu Triângulo de Desbloqueio...',
  'Identificando padrões energéticos...',
  'Determinando sua janela favorável...',
  'Gerando seu Diagnóstico Tridimensional...',
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 5000; // 5 seconds
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / total) * 100, 100);
      setProgress(pct);
      setStepIndex(Math.min(Math.floor(pct / 20), STEPS_TEXT.length - 1));

      if (elapsed >= total) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      {/* Animated mandala */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="text-7xl mb-8 inline-block"
      >
        ✦
      </motion.div>

      <h2 className="text-2xl font-serif text-gold-600 mb-2">
        Analisando seu perfil...
      </h2>
      <p className="text-gray-400 text-sm mb-8">Isso levará apenas alguns segundos</p>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <motion.p
        key={stepIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-500 text-sm h-5"
      >
        {STEPS_TEXT[stepIndex]}
      </motion.p>
    </div>
  );
}
