import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';

const AREA_LABELS: Record<string, string> = {
  financeiro: 'Prosperidade Financeira',
  relacionamentos: 'Relacionamentos',
  saude: 'Saúde e Vitalidade',
  proposito: 'Propósito e Missão',
};

export function Checkout() {
  const [orderBump, setOrderBump] = useState(false);
  const { diagnosis } = useQuizStore();
  const areaLabel = diagnosis ? (AREA_LABELS[diagnosis.blocked_area] ?? diagnosis.blocked_area) : 'seu bloqueio';

  const total = orderBump ? 4.9 + 17 : 4.9;

  return (
    <div className="max-w-lg mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-gold-500 font-medium uppercase tracking-wide mb-1">Oferta exclusiva</p>
        <h2 className="text-2xl md:text-3xl font-serif text-gold-600">
          Desbloqueie {areaLabel}
        </h2>
        <p className="text-gray-500 text-sm mt-2">Acesso completo ao Calendário de Desbloqueio</p>
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
            <p className="text-xs text-gray-400 mt-0.5">Acesso por 7 dias • depois R$24,90/mês</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 line-through">R$97,00</p>
            <p className="text-2xl font-bold text-gold-600">R$4,90</p>
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
        className={`border-2 rounded-xl p-4 mb-5 cursor-pointer transition-colors ${
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
              + Adicionar: Guia "21 Rituais de Desbloqueio" — <span className="text-gold-600">R$17,00</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Rituais práticos para acelerar o desbloqueio em cada área da vida.
            </p>
          </div>
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
          <span className="text-xl font-bold text-gray-800">R${total.toFixed(2).replace('.', ',')}</span>
        </div>

        <button className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg mb-3">
          Começar minha transformação →
        </button>

        <p className="text-center text-xs text-gray-400">
          🔒 Pagamento seguro · Garantia de 7 dias · Cancele quando quiser
        </p>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-gray-400">
          ★★★★★ Mais de 3.847 mulheres já desbloquearam seu potencial
        </p>
      </motion.div>
    </div>
  );
}
