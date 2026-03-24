import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { AUTHORITY_IMAGE_URL, AUTHORITY_NAME, AUTHORITY_TITLE } from '../../../config/authorityImage';

const AREA_LABELS: Record<string, string> = {
  financeiro: 'Prosperidade Financeira',
  relacionamentos: 'Relacionamentos',
  saude: 'Saúde e Vitalidade',
  proposito: 'Propósito e Missão',
};

const TESTIMONIALS = [
  { name: 'Ana C.', location: 'São Paulo, SP', text: 'Quitei R$4.200 em 47 dias depois de descobrir meu bloqueio. Incrível!' },
  { name: 'Juliana M.', location: 'Curitiba, PR', text: 'Em 3 semanas recebi uma proposta de emprego 40% maior. Funcionou de verdade.' },
  { name: 'Patrícia R.', location: 'Rio de Janeiro, RJ', text: 'Finalmente entendi por que o dinheiro sempre sumia. Minha vida mudou.' },
];

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(remaining / 60).toString().padStart(2, '0');
  const s = (remaining % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Checkout() {
  const [orderBump, setOrderBump] = useState(false);
  const { diagnosis, userName, destinyNumber } = useQuizStore();
  const areaLabel = diagnosis ? (AREA_LABELS[diagnosis.blocked_area] ?? diagnosis.blocked_area) : 'seu bloqueio';
  const timer = useCountdown(14 * 60 + 59);
  const firstName = userName ? userName.trim().split(' ')[0] : null;

  const basePrice = 9.90;
  const total = orderBump ? basePrice + 17 : basePrice;

  return (
    <div className="max-w-lg mx-auto px-4 pb-12">

      {/* Timer banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 py-3 px-4 rounded-xl"
        style={{ background: 'linear-gradient(90deg, #b91c1c, #dc2626)', color: 'white' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide mb-1">⏱ Esta análise expira em</p>
        <p className="text-3xl font-bold font-mono">{timer}</p>
        <p className="text-xs opacity-80 mt-1">Seus dados se perdem após o prazo</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-gold-500 font-medium uppercase tracking-wide mb-1">Oferta exclusiva</p>
        <h2 className="text-2xl md:text-3xl font-serif text-gold-600 leading-snug">
          {firstName ? `${firstName}, desbloqueie` : 'Desbloqueie'} {areaLabel}
        </h2>
        {destinyNumber && (
          <p className="text-sm text-gray-500 mt-1">
            Pessoas com o Número {destinyNumber} estão a UMA decisão de destravar tudo.
          </p>
        )}
      </motion.div>

      {/* Stack visual */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">O que você recebe:</p>
        <div className="space-y-2">
          {[
            { label: 'Calendário de Desbloqueio', value: 'R$97' },
            { label: '21 Rituais de Desbloqueio', value: 'R$67' },
            { label: 'Acesso ao App', value: 'R$47' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <span className="text-gold-500">✦</span> {item.label}
              </span>
              <span className="text-gray-400 line-through text-xs">{item.value}</span>
            </div>
          ))}
          <div className="border-t border-amber-200 pt-2 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Total normal:</span>
            <span className="text-gray-400 line-through text-sm">R$211</span>
          </div>
        </div>
      </motion.div>

      {/* Offer card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-2 border-gold-400 rounded-2xl p-5 mb-4 shadow-md"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-800">Calendário de Desbloqueio</p>
            <p className="text-xs text-gray-400 mt-0.5">Acesso completo imediato</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 line-through">De R$197,00</p>
            <p className="text-3xl font-bold text-gold-600">R$9,90</p>
            <p className="text-xs text-green-600 font-medium">95% de desconto</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-gray-600">
          {[
            `Diagnóstico completo da área ${areaLabel}`,
            `${diagnosis?.favorable_days ?? 14} dias favoráveis mapeados`,
            'Rituais diários personalizados',
            'Calendário vibracional do mês',
            'Acesso ao app Calendário de Desbloqueio',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-gold-500">✓</span> {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Order bump */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-colors ${
          orderBump ? 'border-gold-400 bg-gold-50' : 'border-dashed border-gray-300 bg-white'
        }`}
        onClick={() => setOrderBump((v) => !v)}
      >
        <div className="flex items-start gap-3">
          <span className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
            orderBump ? 'bg-gold-500 border-gold-500' : 'border-gray-300'
          }`}>
            {orderBump && <span className="text-white text-xs">✓</span>}
          </span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              + Adicionar: "21 Rituais de Desbloqueio" — <span className="text-gold-600">R$17,00</span>
              <span className="ml-2 text-xs text-gray-400 line-through">R$67,00</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Rituais práticos para acelerar o desbloqueio em cada área da vida.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Guarantee badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mb-5"
      >
        <span className="text-2xl">🛡️</span>
        <div>
          <p className="text-sm font-semibold text-green-800">Garantia de 7 dias</p>
          <p className="text-xs text-green-700">Reembolso em 1 clique. Sem perguntas, sem burocracia.</p>
        </div>
      </motion.div>

      {/* Total & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>Total hoje:</span>
          <span className="text-2xl font-bold text-gray-800">R${total.toFixed(2).replace('.', ',')}</span>
        </div>

        <button className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg mb-3">
          COMEÇAR MINHA TRANSFORMAÇÃO →
        </button>

        <p className="text-center text-xs text-gray-400">
          🔒 Pagamento 100% seguro · Garantia de 7 dias · Reembolso em 1 clique
        </p>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="mt-8 space-y-3"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 text-center mb-4">
          O que dizem as alunas
        </p>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-700 italic mb-2">"{t.text}"</p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xs">★★★★★</span>
              <p className="text-xs text-gold-600 font-medium">{t.name}</p>
              <p className="text-xs text-gray-400">· {t.location}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Authority social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100"
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
