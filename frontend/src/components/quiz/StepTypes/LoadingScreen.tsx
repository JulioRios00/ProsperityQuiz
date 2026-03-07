import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS_TEXT = [
  'Mapeando seu Triângulo de Desbloqueio...',
  'Cruzando numerologia pessoal + mapa astral + ciclos lunares...',
  'Identificando o bloqueio nas 3 dimensões...',
  'Calculando seus próximos dias favoráveis...',
  'Seu diagnóstico está pronto!',
];

const PARTICLES = [
  { x: '15%', delay: 0,    duration: 3.2 },
  { x: '30%', delay: 0.6,  duration: 2.8 },
  { x: '50%', delay: 1.1,  duration: 3.5 },
  { x: '65%', delay: 0.3,  duration: 2.6 },
  { x: '80%', delay: 0.9,  duration: 3.1 },
  { x: '22%', delay: 1.5,  duration: 2.9 },
  { x: '72%', delay: 0.4,  duration: 3.4 },
  { x: '42%', delay: 1.8,  duration: 2.7 },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 339.3

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 5000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / total) * 100, 100);
      setProgress(pct);
      setStepIndex(Math.min(Math.floor((pct / 100) * STEPS_TEXT.length), STEPS_TEXT.length - 1));

      if (elapsed >= total) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="max-w-lg mx-auto px-4 text-center relative overflow-hidden" style={{ minHeight: 420 }}>
      {/* Floating gold particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            bottom: '-10px',
            width: 5,
            height: 5,
            backgroundColor: '#D4A855',
            opacity: 0.5,
          }}
          animate={{ y: [0, -380], opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="relative z-10 pt-8">
        {/* Circular progress */}
        <div className="flex justify-center mb-8">
          <div className="relative" style={{ width: 136, height: 136 }}>
            <svg width="136" height="136" viewBox="0 0 136 136">
              {/* Track */}
              <circle
                cx="68" cy="68" r={RADIUS}
                fill="none"
                stroke="#E8D5A3"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <circle
                cx="68" cy="68" r={RADIUS}
                fill="none"
                stroke="#C8963E"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 68 68)"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            {/* Percentage label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gold-600" style={{ color: '#C8963E' }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-gold-600 mb-6">
          Analisando seu perfil...
        </h2>

        {/* Animated step text */}
        <div className="h-12 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-gray-500 text-sm text-center"
            >
              {STEPS_TEXT[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
