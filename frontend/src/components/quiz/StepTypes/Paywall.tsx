import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { AUTHORITY_IMAGE_URL, AUTHORITY_NAME, AUTHORITY_TITLE } from '../../../config/authorityImage';

// TODO: replace with actual checkout URL
const CHECKOUT_URL = '#';

const TIMER_SECONDS = 14 * 60 + 59; // 14:59

const VALUE_STACK = [
  { label: 'Calendário de Desbloqueio Personalizado', value: 'R$97' },
  { label: '21 Rituais de Prosperidade',              value: 'R$67' },
  { label: 'Acesso ao App Completo',                  value: 'R$47' },
];

const TESTIMONIALS = [
  {
    name: 'Adriana S.',
    text: 'Em 3 semanas seguindo o calendário minha renda aumentou 40%. Parecia impossível mas funcionou.',
    stars: 5,
    age: '38 anos',
  },
  {
    name: 'Cláudia M.',
    text: 'Finalmente entendi porque o dinheiro sempre sumia. O diagnóstico foi cirúrgico.',
    stars: 5,
    age: '44 anos',
  },
  {
    name: 'Fernanda R.',
    text: 'Investi R$9,90 com medo, mas em 2 meses recuperei R$3.200 que achei que nunca veria.',
    stars: 5,
    age: '51 anos',
  },
];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

interface PaywallProps {
  step: number;
  onNext: () => void;
}

export function Paywall({}: PaywallProps) {
  const { userName, diagnosis } = useQuizStore();
  const firstName = userName ? userName.trim().split(' ')[0] : null;
  const timer = useCountdown(TIMER_SECONDS);

  return (
    <div className="max-w-lg mx-auto px-4 pb-16">
      {/* Urgency timer banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-600 text-white text-center py-3 rounded-xl mb-6 font-bold text-lg tracking-wide"
      >
        ⏳ Esta oferta expira em{' '}
        <span className="font-mono text-xl">{timer}</span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-serif text-gold-600 leading-snug mb-2">
          {firstName
            ? `${firstName}, seu Calendário de Desbloqueio está pronto.`
            : 'Seu Calendário de Desbloqueio está pronto.'}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Acesse agora com seus{' '}
          <strong className="text-gold-600">
            {diagnosis?.favorable_days ?? 14} dias favoráveis
          </strong>{' '}
          e comece a destravar sua prosperidade hoje.
        </p>
      </motion.div>

      {/* Value stack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4"
      >
        <p className="text-xs text-center text-gray-400 uppercase tracking-wide mb-3">
          O que você leva hoje
        </p>
        <div className="space-y-2">
          {VALUE_STACK.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <span className="text-gold-500">✦</span> {item.label}
              </span>
              <span className="text-gray-400 line-through text-xs">{item.value}</span>
            </div>
          ))}
          <div className="border-t border-amber-200 pt-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 line-through">De R$197</p>
              <p className="text-sm font-semibold text-gray-700">Hoje por apenas:</p>
            </div>
            <span className="text-3xl font-bold text-gold-600">R$9,90</span>
          </div>
        </div>
      </motion.div>

      {/* Guarantee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mb-5"
      >
        <span className="text-2xl">🛡️</span>
        <div>
          <p className="text-sm font-semibold text-green-800">Garantia de 7 dias</p>
          <p className="text-xs text-green-700">Reembolso em 1 clique. Sem perguntas.</p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="block w-full text-center bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg mb-3"
      >
        QUERO DESTRAVAR AGORA →
      </motion.a>

      <p className="text-center text-xs text-gray-400 mb-8">
        🔒 Pagamento 100% seguro · Garantia de 7 dias · Reembolso em 1 clique
      </p>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="space-y-4 mb-8"
      >
        <p className="text-xs text-center text-gray-400 uppercase tracking-wide">
          O que dizem as mulheres que desbloquearam
        </p>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">{t.name}</p>
                <p className="text-xs text-gray-400">{t.age}</p>
              </div>
              <span className="ml-auto text-xs text-yellow-400">{'★'.repeat(t.stars)}</span>
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">"{t.text}"</p>
          </div>
        ))}
      </motion.div>

      {/* Authority */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100"
      >
        <img
          src={AUTHORITY_IMAGE_URL}
          alt={AUTHORITY_NAME}
          className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0"
        />
        <div>
          <p className="text-xs text-gray-700 italic leading-snug">
            "Esse método mudou a vida de mais de 3.847 mulheres. Chegou a sua vez."
          </p>
          <p className="text-xs text-gold-600 font-medium mt-1">
            {AUTHORITY_NAME} · {AUTHORITY_TITLE}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
