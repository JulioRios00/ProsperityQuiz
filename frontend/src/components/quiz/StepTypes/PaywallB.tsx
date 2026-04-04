import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKOUT_URL = 'https://pay.hotmart.com/X104864827J?checkoutMode=10';

const TOTAL_SECONDS = 14 * 60 + 59; // 14:59

function useCountdown() {
  const [secs, setSecs] = useState(TOTAL_SECONDS);
  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secs]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return { mm, ss, expired: secs === 0 };
}

const TESTIMONIALS = [
  {
    name: 'Márcia',
    age: '45 anos',
    city: 'Belo Horizonte MG',
    text: 'Comecei a agir certo nos dias certos, e ',
    bold: 'depois de 2 meses e meio meu salão está lotando todos os dias praticamente.',
    after: ' Obrigadaa Renata s2!!',
  },
  {
    name: 'Patrícia',
    age: '55 anos',
    city: 'São Paulo SP',
    text: 'Segui o calendário por 2 semanas e ',
    bold: 'fechei um contrato que estava parado há 5 meses.',
    after: ' No dia exato que o app marcou.',
  },
  {
    name: 'Fernanda',
    age: '30 anos',
    city: 'Rio de Janeiro RJ',
    text: 'Comecei a agir nos dias favoráveis e ',
    bold: 'em 3 meses quitei uma dívida que me perseguia há 2 anos.',
    after: '',
  },
];

interface Props {
  step: number;
  onNext: () => void;
}

export function PaywallB({}: Props) {
  const { mm, ss, expired } = useCountdown();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'O que exatamente eu recebo?',
      a: 'Calendário de Abundância personalizado, 21 Rituais de Desbloqueio e acesso ao App com alertas 24h antes dos seus dias favoráveis.',
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim. Com 1 clique, sem burocracia, sem perguntas. Garantia total de 7 dias — se não sentir diferença, cancele e não paga mais nada.',
    },
    {
      q: 'O método funciona pra qualquer pessoa?',
      a: 'Foi criado especialmente para mulheres que sentem que algo invisível trava sua prosperidade — mesmo trabalhando muito.',
    },
  ];

  return (
    <div className="max-w-[480px] mx-auto px-4 pb-16 bg-[#FFF8F0]">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pt-6 pb-4"
      >
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-gold-50 border border-gold-400 text-gold-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-sm">
          ✨ SEU DIAGNÓSTICO ESTÁ PRONTO
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-3xl md:text-4xl text-gold-600 text-center leading-tight mb-4"
      >
        Calendário + 21 Rituais + App
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-gray-600 text-center leading-relaxed mb-6"
      >
        Tudo que você precisa para destravar o dinheiro usando o timing certo — personalizado para o seu perfil numerológico.
      </motion.p>

      {/* Stack visual */}
      <div className="border border-gold-200 rounded-2xl overflow-hidden mb-6">
        {[
          { icon: '📅', title: 'Calendário de Abundância', desc: 'Dias favoráveis e desfavoráveis personalizados, atualizado todo mês', real: 'R$ 97,00' },
          { icon: '🔮', title: '21 Rituais de Desbloqueio', desc: 'Um ritual para cada tipo de bloqueio identificado no seu perfil', real: 'R$ 67,00' },
          { icon: '📱', title: 'App com Alertas Automáticos', desc: 'Notificação 24h antes de cada dia favorável do seu calendário', real: 'R$ 37,00' },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 ${i % 2 === 0 ? 'bg-gold-50' : 'bg-white'}`}
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-400 line-through">{item.real}</p>
              <p className="text-xs text-green-600 font-bold">Incluso</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timer */}
      <div className="bg-[#1a0e2e] rounded-2xl p-5 mb-6 text-center">
        <p className="text-gold-400 text-sm font-semibold mb-3">
          ⏰ Esta oferta especial expira em:
        </p>
        <div className="flex justify-center items-center gap-2 mb-2">
          {[{ val: mm, label: 'Min' }, { val: ss, label: 'Seg' }].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="bg-white/10 border border-gold-500/40 rounded-xl w-16 h-16 flex items-center justify-center">
                <span className="text-3xl font-bold text-white font-mono">{val}</span>
              </div>
              <span className="text-gold-400 text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>
        {expired && (
          <p className="text-red-400 text-xs font-semibold">O tempo expirou — acesse agora antes que o preço suba.</p>
        )}
        {!expired && (
          <p className="text-gray-400 text-xs">Quando o tempo zerar, o preço volta a R$197,00.</p>
        )}
      </div>

      {/* Price anchor */}
      <div className="text-center bg-white border-2 border-gold-400 rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-gray-400 text-lg line-through mb-1">De R$ 197,00</p>
        <p className="text-gold-600 text-5xl font-bold mb-1">R$9,90</p>
        <p className="text-sm text-gray-500">pagamento único</p>
        <p className="text-xs text-gray-400 mt-1">Menos de R$0,33 por dia para saber exatamente QUANDO agir.</p>
      </div>

      {/* CTA primary */}
      <div className="mb-6">
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-[60px] bg-[#C8963E] text-[#0D0B1A] text-lg font-bold rounded-xl shadow-lg animate-pulse"
        >
          QUERO CALENDÁRIO + RITUAIS + APP →
        </a>
        <p className="text-center text-xs text-gray-500 mt-2">
          🔒 Pagamento 100% seguro · Garantia de 7 dias
        </p>
      </div>

      {/* Guarantee */}
      <div className="bg-green-50 border border-green-300 rounded-2xl p-5 mb-6">
        <p className="font-bold text-green-800 text-base mb-2">🛡️ Garantia de 7 Dias</p>
        <p className="text-sm text-green-700 leading-relaxed">
          Se em 7 dias você não sentir diferença, cancele e não pague nada. Sem perguntas. Sem burocracia. O risco é todo nosso.
        </p>
      </div>

      {/* Testimonials */}
      <div className="mb-6">
        <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          O que dizem quem já desbloqueou
        </p>
        <div className="space-y-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gold-100 border-2 border-[#C8963E] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{t.name}, {t.age}</p>
                  <p className="text-xs text-gray-500">{t.city}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} style={{ color: '#C8963E' }} className="text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "{t.text}<strong>{t.bold}</strong>{t.after}"
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                <span className="text-xs text-green-600 font-medium">Compra verificada</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA secondary */}
      <div className="mb-6">
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-[60px] bg-[#C8963E] text-[#0D0B1A] text-lg font-bold rounded-xl shadow-lg"
        >
          QUERO COMEÇAR HOJE → R$9,90
        </a>
        <p className="text-center text-xs text-gray-500 mt-2">
          Garantia de 7 dias. Acesso imediato.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <p className="text-center text-sm font-bold text-gray-700 mb-3">Perguntas Frequentes</p>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-gray-800 pr-2">{faq.q}</span>
                <span className="text-gold-500 flex-shrink-0 text-lg font-bold">
                  {faqOpen === i ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { icon: '🔒', label: 'Pagamento Seguro' },
          { icon: '⚡', label: 'Acesso Imediato' },
          { icon: '🛡️', label: 'Garantia 7 Dias' },
          { icon: '❌', label: 'Cancele Quando Quiser' },
        ].map((b, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-2 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-xl">{b.icon}</span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight">{b.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
