import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { track } from '../../../services/analyticsService';

interface EmailCaptureProps {
  step: number;
  onNext: () => void;
}

export function EmailCapture({ onNext }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { sessionToken, responses, saveStepResponse, setDiagnosis } = useQuizStore();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError('');
    saveStepResponse(13, email);
    track({ session_id: sessionToken ?? undefined, event_type: 'email_submitted', screen_id: 14 });

    try {
      const captured = await quizService.captureEmail(email, sessionToken!, responses as Record<string, unknown>);
      // Use diagnosis returned by capture-email; fall back to separate call if missing
      const diagnosis = captured.diagnosis ?? await quizService.generateDiagnosis(sessionToken!);
      setDiagnosis(diagnosis);
      onNext();
    } catch {
      setError('Algo deu errado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      {/* Checkmark icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-4"
      >
        <div className="w-16 h-16 rounded-full bg-gold-50 border-2 border-gold-300 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14L11 19L22 9" stroke="#C8963E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 mb-3"
      >
        Seu Diagnóstico Tridimensional está pronto!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-gray-600 mb-8 leading-relaxed"
      >
        Digite seu melhor email para salvar seu diagnóstico e receber seus{' '}
        <strong>dias favoráveis do mês</strong>.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-base focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Gerando diagnóstico...' : 'Ver meu diagnóstico →'}
        </button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-xs mt-4"
      >
        🔒 Seus dados estão seguros. Sem spam.
      </motion.p>
    </div>
  );
}
