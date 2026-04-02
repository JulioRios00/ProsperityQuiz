import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { calcExpressionLive, calcExpressionNumber, calcDestinyNumber, calcProsperityBlock } from '../../../utils/numerology';

interface Props {
  step: number;
  onNext: () => void;
}

export function NameInput({ step, onNext }: Props) {
  const { sessionToken, saveStepResponse, setUserData, userBirthDate } = useQuizStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const liveNumber = calcExpressionLive(name);

  // Show insight only after user stops typing for 1s
  useEffect(() => {
    if (name.trim().length < 3) {
      setShowInsight(false);
      return;
    }
    setShowInsight(false);
    const timer = setTimeout(() => setShowInsight(true), 1000);
    return () => clearTimeout(timer);
  }, [name]);

  const handleContinue = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const expression = calcExpressionNumber(name.trim());
    const destiny = userBirthDate ? calcDestinyNumber(userBirthDate) : 0;
    const block = calcProsperityBlock(destiny, expression);
    saveStepResponse(step, name.trim());
    setUserData(
      name.trim(),
      userBirthDate ?? '',
      destiny,
      expression,
      block
    );
    try {
      await quizService.saveStep(sessionToken!, step, name.trim());
    } catch { /* continue */ }
    setLoading(false);
    onNext();
  };

  return (
    <div className="max-w-md mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-4xl mb-4">✨</div>
        <h2 className="text-2xl md:text-3xl font-serif text-gold-600 mb-3 leading-snug">
          Cada letra do seu nome vibra em uma frequência.
        </h2>
        <p className="text-gray-500 text-sm">Qual é o seu nome completo?</p>
      </motion.div>

      {/* Live vibrational display */}
      {liveNumber > 0 && (
        <motion.div
          key={liveNumber}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
            {/* Pulsing rings */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-gold-400"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
              className="absolute inset-0 rounded-full border border-gold-300"
            />
            <span className="text-3xl font-bold text-gold-600">{liveNumber}</span>
          </div>
          <p className="text-xs text-gold-500 font-medium tracking-wide">
            Vibrações detectadas: {liveNumber}
          </p>
        </motion.div>
      )}

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleContinue()}
            placeholder="Seu nome completo..."
            className="w-full px-5 py-4 text-lg text-center border-2 border-gold-300 rounded-2xl focus:outline-none focus:border-gold-500 bg-white font-serif text-gray-800 placeholder-gray-300"
            autoFocus
          />
        </div>

        {/* Letter-by-letter golden glow */}
        {name.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {name.split('').map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`text-sm font-bold ${letter.trim() ? 'text-gold-500' : 'text-gray-300'}`}
              >
                {letter === ' ' ? '\u00A0' : letter.toUpperCase()}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Mini insight — only shows after user pauses typing */}
      {showInsight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800"
        >
          <span className="font-semibold">Interessante...</span> seu nome tem{' '}
          <span className="font-bold text-gold-600">
            {name.trim().replace(/\s+/g, ' ').split('').filter(c => c !== ' ').length}
          </span>{' '}
          letras. Nomes com essa vibração costumam carregar um bloqueio muito específico.
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: name.trim().length >= 2 ? 1 : 0.4 }}
        onClick={handleContinue}
        disabled={name.trim().length < 2 || loading}
        className="btn-primary w-full py-4 text-lg disabled:cursor-not-allowed"
      >
        {loading ? 'Calculando...' : 'Continuar Meu Diagnóstico'}
      </motion.button>
    </div>
  );
}
