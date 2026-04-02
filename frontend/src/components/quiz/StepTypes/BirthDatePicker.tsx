import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';
import { calcDestinyNumber, calcExpressionNumber, calcProsperityBlock } from '../../../utils/numerology';

interface Props {
  step: number;
  onNext: () => void;
}

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const CYCLE_BY_MONTH: Record<number, string> = {
  1: 'Início', 2: 'Manifestação', 3: 'Crescimento', 4: 'Consolidação',
  5: 'Transformação', 6: 'Harmonia', 7: 'Intuição', 8: 'Abundância',
  9: 'Conclusão', 10: 'Renovação', 11: 'Iluminação', 12: 'Integração',
};

export function BirthDatePicker({ step, onNext }: Props) {
  const { sessionToken, saveStepResponse, setUserData, userName } = useQuizStore();
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const destiny = date ? calcDestinyNumber(date) : null;
  const monthNum = date ? parseInt(date.split('-')[1]) : null;

  const handleContinue = async () => {
    if (!date) return;
    setLoading(true);
    const destinyNum = calcDestinyNumber(date);
    const expression = userName ? calcExpressionNumber(userName) : 0;
    const block = calcProsperityBlock(destinyNum, expression);
    saveStepResponse(step, date);
    setUserData(userName ?? '', date, destinyNum, expression, block);
    try {
      await quizService.saveStep(sessionToken!, step, date);
    } catch { /* continue */ }
    setLoading(false);
    onNext();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a1228 50%, #0d0a18 100%)' }}
    >
      <div className="max-w-md w-full text-center">
        {/* Stars decoration */}
        <div className="flex justify-center gap-3 mb-6">
          {['✦','★','✦'].map((s, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              className="text-yellow-400 text-lg"
            >
              {s}
            </motion.span>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-serif mb-3 leading-snug" style={{ color: '#D4A855' }}>
            Sua data de nascimento define seu Número do Destino Financeiro.
          </h2>
          <p className="text-sm" style={{ color: '#a89070' }}>Quando você nasceu?</p>
        </motion.div>

        {/* Destiny number live display */}
        {destiny !== null && (
          <motion.div
            key={destiny}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid #D4A855', borderTopColor: 'transparent', opacity: 0.6 }}
              />
              <span className="text-4xl font-bold" style={{ color: '#D4A855' }}>{destiny}</span>
            </div>
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#D4A855' }}>
              Número do Destino Financeiro
            </p>
          </motion.div>
        )}

        {/* Mystic date picker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-5 py-4 text-lg text-center rounded-2xl focus:outline-none font-serif"
            style={{
              background: 'rgba(212,168,85,0.1)',
              border: '2px solid #D4A855',
              color: '#D4A855',
              colorScheme: 'dark',
            }}
          />
        </motion.div>

        {/* Mini insight */}
        {monthNum && date && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 mb-6 text-sm"
            style={{ background: 'rgba(212,168,85,0.08)', border: '1px solid rgba(212,168,85,0.3)', color: '#c8a060' }}
          >
            Pessoas nascidas em{' '}
            <span style={{ color: '#D4A855', fontWeight: 700 }}>{MONTHS[monthNum - 1]}</span>{' '}
            frequentemente carregam o Bloqueio do Ciclo de{' '}
            <span style={{ color: '#D4A855', fontWeight: 700 }}>{CYCLE_BY_MONTH[monthNum]}</span>.
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: date ? 1 : 0.4 }}
          onClick={handleContinue}
          disabled={!date || loading}
          className="w-full py-4 text-lg font-bold rounded-xl transition-colors disabled:cursor-not-allowed"
          style={{
            background: date ? '#D4A855' : '#5a4a2a',
            color: '#0a0a14',
          }}
        >
          {loading ? 'Calculando...' : 'Continuar meu diagnóstico →'}
        </motion.button>
      </div>
    </div>
  );
}
