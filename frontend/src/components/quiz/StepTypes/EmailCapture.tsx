import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';

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

    try {
      // 1. Capture email
      await quizService.captureEmail(email, sessionToken!, responses as Record<string, unknown>);

      // 2. Generate diagnosis
      const diagnosis = await quizService.generateDiagnosis(sessionToken!);
      setDiagnosis(diagnosis);

      onNext();
    } catch {
      setError('Algo deu errado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <span className="text-5xl">📬</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 mb-3"
      >
        Seu Diagnóstico está pronto!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-2"
      >
        Onde devemos enviar seu <strong>Diagnóstico Tridimensional</strong>?
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-sm mb-8"
      >
        Também enviaremos seu calendário de dias favoráveis por e-mail.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
        transition={{ delay: 0.7 }}
        className="text-gray-400 text-xs mt-4"
      >
        🔒 Seus dados estão protegidos. Sem spam, prometemos.
      </motion.p>
    </div>
  );
}
