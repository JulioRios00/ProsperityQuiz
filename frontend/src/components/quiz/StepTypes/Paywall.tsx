import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '../../../services/analyticsService';
import { useQuizStore } from '../../../store/quizStore';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const CHECKOUT_URL = 'https://pay.hotmart.com/X104864827J?checkoutMode=10';

function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return { mm, ss };
}

const MARCIA_PHOTO = '/public/marcia.jpg';

const PATRICIA_PHOTO = '/public/patricia.jpg';

const FERNANDA_PHOTO = '/public/fernanda.jpg';
interface PaywallProps {
  step: number;
  onNext: () => void;
}

export function Paywall({}: PaywallProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const scriptLoadedRef = useRef(false);
  const lunar = useCountdown(10 * 60);
  const { sessionToken } = useQuizStore();

  const handleCheckoutClick = () => {
    track({ session_id: sessionToken ?? undefined, event_type: 'checkout_click', screen_id: 'paywall' });
  };

  useEffect(() => {
    // Performance timing script
    (window as Window & { _plt?: number })._plt =
      (window as Window & { _plt?: number })._plt ||
      (performance?.timeOrigin ? performance.timeOrigin + performance.now() : Date.now());

    // Load Vturb player script once
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.src =
        'https://scripts.converteai.net/859d3a9a-adcf-4da6-86a3-43be35f0e474/players/69cc6fc72aa9a5be9ed83776/v4/player.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Unlock after 42 seconds
    const timer = setTimeout(() => setUnlocked(true), 42000);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      q: 'O que exatamente eu recebo ao assinar?',
      a: 'Você recebe o Diagnóstico Tridimensional completo, o Calendário de Abundância personalizado atualizado mensalmente, alertas 24h antes dos seus dias favoráveis, o Perfil Financeiro Tridimensional, Previsão Lunar do mês e o Plano de Ação Personalizado.',
    },
    {
      q: 'Em quanto tempo vou ver resultados?',
      a: 'A maioria das usuárias começa a perceber mudanças nas primeiras 2 a 4 semanas. Ao alinhar suas ações com os dias favoráveis do seu perfil, os esforços passam a render muito mais — mesmo sem trabalhar mais.',
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim. Com 1 clique, sem burocracia, sem perguntas. Garantia total com estorno em até 30 dias. Se não sentir diferença, cancele e não paga mais nada.',
    },
    {
      q: 'O método funciona pra qualquer pessoa?',
      a: 'O TimingGold foi criado especialmente para mulheres que sentem que algo invisível trava sua prosperidade — mesmo trabalhando muito. Se você se identifica com esse padrão, o método é pra você.',
    },
  ];

  return (
    <div className="max-w-[480px] mx-auto px-4 pb-16 bg-[#FFF8F0] font-[DM_Sans,sans-serif]">

      {/* BLOCK 1 — Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pt-6 pb-4"
      >
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-gold-50 border border-gold-400 text-gold-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-sm">
          ✨ SEU DIAGNÓSTICO TRIDIMENSIONAL ESTÁ PRONTO
        </span>
      </motion.div>

      {/* BLOCK 2 — VSL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <vturb-smartplayer
          id="vid-69cc6fc72aa9a5be9ed83776"
          style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}
        ></vturb-smartplayer>
      </motion.div>

      {/* BLOCK 3 — Headline */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="font-serif text-4xl md:text-5xl text-gold-600 text-center leading-tight mb-4"
      >
        Chega de Sobreviver, Você Nasceu Pra Fluir.
      </motion.h1>

      {/* BLOCK 4 — Support text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600 text-center leading-relaxed mb-6"
      >
        Em 2 minutos seu diagnóstico revelou o que te trava — e seu calendário mostra os dias em que tudo solta. Personalizado, atualizado, sem esforço extra. Só timing certo. +3.800 mulheres já fizeram a virada — seus dias favoráveis deste mês estão passando.
      </motion.p>

      {/* BLUR GATE WRAPPER */}
      <div className="relative">
        {/* Blur overlay when locked */}
        {!unlocked && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-10 backdrop-blur-sm bg-[#FFF8F0]/60 rounded-xl">
            <div className="bg-white/90 border border-gold-400 rounded-2xl px-6 py-5 mx-4 text-center shadow-lg">
              <p className="text-base font-semibold text-gray-800">
                🔒 Assista o vídeo para desbloquear seu diagnóstico completo
              </p>
            </div>
          </div>
        )}

        {/* Gated content wrapper */}
        <div
          className={`transition-all duration-1000 ${
            unlocked ? 'blur-0 pointer-events-auto opacity-100' : 'blur-sm pointer-events-none select-none opacity-60'
          }`}
        >

          {/* BLOCK 5 — SEM vs COM */}
          <div className="mb-6 space-y-3">
            <div className="border border-red-300 rounded-2xl p-4 bg-red-50">
              <p className="font-bold text-red-700 mb-2">❌ Sem o Calendário de Abundância:</p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Você continua tomando decisões financeiras no escuro</li>
                <li>• O dinheiro entra e some no mesmo ciclo de sempre</li>
                <li>• Você trabalha o dobro nos dias errados e colhe metade</li>
                <li>• Cada oportunidade perdida num dia favorável não volta</li>
                <li>• Você continua sentindo que algo invisível te trava</li>
                <li>• E daqui a 6 meses: por que não mudei quando tive a chance?</li>
              </ul>
            </div>
            <div className="border border-green-300 rounded-2xl p-4 bg-green-50">
              <p className="font-bold text-green-700 mb-2">✅ Com o Calendário de Abundância:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Você sabe EXATAMENTE quais dias agir e quais ficar quieta</li>
                <li>• Negociações acontecem nos dias em que o bloqueio está fraco</li>
                <li>• Mesmo esforço, resultado multiplicado — timing a favor</li>
                <li>• Alertas 24h antes de cada dia favorável</li>
                <li>• Os rituais impedem o bloqueio de se recuperar nos dias vermelhos</li>
                <li>• Em 4 semanas, 87% das mulheres relatam vida financeira diferente</li>
              </ul>
            </div>
            <p className="text-center text-sm font-semibold text-gray-700">
              👆 Você decide. Qual das duas opções faz sentido pra você?
            </p>
          </div>

          {/* BLOCK 6 — Lunar timer */}
          <div className="bg-[#1a0e2e] rounded-2xl p-5 mb-6 text-center">
            <p className="text-gold-400 text-sm font-semibold mb-3">
              ⏰ Oferta especial expira em:
            </p>
            <div className="flex justify-center gap-3 mb-3">
              {[
                { val: lunar.mm, label: 'Min' },
                { val: lunar.ss, label: 'Seg' },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="bg-white/10 border border-gold-500/40 rounded-xl w-14 h-14 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white font-mono">{val}</span>
                  </div>
                  <span className="text-gold-400 text-xs mt-1">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              Quando o tempo zerar, o preço volta ao valor original.
            </p>
          </div>

          {/* BLOCK 7 — Deliverables */}
          <div className="mb-6">
            <p className="text-center text-xs font-bold text-gold-600 uppercase tracking-widest mb-3">
              O QUE VOCÊ RECEBE
            </p>
            <div className="border border-gold-200 rounded-2xl overflow-hidden">
              {[
                {
                  icon: '🔮',
                  title: 'Diagnóstico Tridimensional Completo',
                  desc: 'Seu padrão de bloqueio com nome, intensidade e origem',
                  real: 'R$ 97,00',
                },
                {
                  icon: '📅',
                  title: 'Calendário de Abundância (atualiza todo mês)',
                  desc: 'Dias favoráveis e desfavoráveis personalizados',
                  real: 'R$ 67/mês',
                },
                {
                  icon: '🔔',
                  title: 'Alertas Automáticos 24h Antes',
                  desc: 'Notificação antes de cada dia favorável',
                  real: 'R$ 37/mês',
                },
                {
                  icon: '📊',
                  title: 'Perfil Financeiro Tridimensional',
                  desc: 'Ano Pessoal + Número de Expressão + Ciclo Lunar',
                  real: 'R$ 47,00',
                },
                {
                  icon: '🌙',
                  title: 'Previsão Lunar + Trânsitos do Mês',
                  desc: 'Como os ciclos cósmicos afetam SEU perfil',
                  real: 'R$ 37,00',
                },
                {
                  icon: '✨',
                  title: 'Plano de Ação Personalizado',
                  desc: 'O que fazer em cada tipo de dia',
                  real: 'R$ 47,00',
                },
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
          </div>

          {/* BLOCK 8 — Price anchor */}
          <div className="text-center bg-white border-2 border-gold-400 rounded-2xl p-5 mb-6 shadow-sm">
            <p className="text-gray-400 text-lg line-through mb-1">Valor total: R$ 332,00</p>
            <p className="text-gold-600 text-4xl font-bold mb-1">R$37,90<span className="text-xl">/mês</span></p>
            <p className="text-sm text-gray-600 mb-1">Menos de R$1,27 por dia para saber exatamente QUANDO agir.</p>
            <p className="text-xs text-gray-500">Cancela quando quiser. Sem contrato, sem fidelidade.</p>
          </div>

          {/* BLOCK 9 — CTA primary */}
          <div className="mb-6">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCheckoutClick}
              className={`flex items-center justify-center w-full h-[60px] bg-[#C8963E] text-[#0D0B1A] text-lg font-bold rounded-xl shadow-lg transition-all ${unlocked ? 'animate-pulse' : ''}`}
            >
              ACESSAR MEU CALENDÁRIO DE ABUNDÂNCIA →
            </a>
            <p className="text-center text-xs text-gray-500 mt-2">
              🔒 Pagamento 100% seguro · Cancele quando quiser · Seus dados estão protegidos
            </p>
          </div>

          {/* BLOCK 10+11 — Order bumps */}
          <div className="bg-white border border-gold-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-bold text-center text-gray-800 mb-3">Potencialize Seus Resultados</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <p className="text-sm font-semibold text-gray-700">📍 Mapa dos 7 Primeiros Dias (+R$8,98)</p>
              </div>
              <div className="flex items-start gap-3">
                <p className="text-sm font-semibold text-gray-700">📍 21 Rituais de Desbloqueio (+R$19,98)</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Você poderá selecionar na próxima tela.</p>
          </div>

          {/* BLOCK 12 — Guarantee */}
          <div className="bg-green-50 border border-green-300 rounded-2xl p-5 mb-6">
            <p className="font-bold text-green-800 text-base mb-2">🛡️ Garantia de 30 Dias</p>
            <p className="text-sm text-green-700 leading-relaxed">
              Se em 30 dias você não sentir diferença na sua vida financeira, cancele e não pague mais nada. Sem perguntas. Sem burocracia. Você tem 30 dias completos para testar o calendário, seguir os dias favoráveis e ver se faz sentido pra você. O risco é zero.
            </p>
          </div>

          {/* BLOCK 13 — Testimonials */}
          <div className="mb-6">
            <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              O que dizem quem já desbloqueou
            </p>
            <p className="text-center text-sm text-gold-600 font-semibold mb-4">
              Resultados reais de usuárias do TimingGold
            </p>
            <div className="space-y-4">
              {[
                {
                  photo: MARCIA_PHOTO,
                  name: 'Márcia',
                  age: '45 anos',
                  city: 'Belo Horizonte MG',
                  text: 'Meu salão de beleza estava às moscas até eu encontrar o TimingGold. Comecei a agir certo nos dias certos, e ',
                  bold: 'depois de 2 meses e meio meu salão está lotando todos os dias praticamente.',
                  after: ' Obrigadaa Renata s2!!',
                },
                {
                  photo: PATRICIA_PHOTO,
                  name: 'Patrícia',
                  age: '55 anos',
                  city: 'São Paulo SP',
                  text: 'Fiz o diagnóstico sem esperar nada. Segui o calendário por 2 semanas e ',
                  bold: 'fechei um contrato que estava parado há 5 meses.',
                  after: ' No dia exato que o app marcou.',
                },
                {
                  photo: FERNANDA_PHOTO,
                  name: 'Fernanda',
                  age: '30 anos',
                  city: 'Rio de Janeiro RJ',
                  text: 'Eu achava que o problema era eu. Era o dia. Comecei a agir nos dias favoráveis e ',
                  bold: 'em 3 meses quitei uma dívida que me perseguia há 2 anos.',
                  after: '',
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#C8963E] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">
                        {t.name}, {t.age}
                      </p>
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

          {/* BLOCK 15 — CTA secondary */}
          <div className="mb-6">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCheckoutClick}
              className="flex items-center justify-center w-full h-[60px] bg-[#C8963E] text-[#0D0B1A] text-lg font-bold rounded-xl shadow-lg transition-all hover:bg-gold-600"
            >
              QUERO COMEÇAR HOJE → R$37,90/mês
            </a>
            <p className="text-center text-xs text-gray-500 mt-2">
              Cancele quando quiser. Garantia de 30 dias.
            </p>
          </div>

          {/* BLOCK 16 — FAQ */}
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

          {/* BLOCK 17 — Trust badges */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { icon: '🔒', label: 'Pagamento Seguro' },
              { icon: '⚡', label: 'Acesso Imediato' },
              { icon: '🛡️', label: 'Garantia 30 Dias' },
              { icon: '❌', label: 'Cancele Quando Quiser' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-2 flex flex-col items-center gap-1 shadow-sm">
                <span className="text-xl">{b.icon}</span>
                <span className="text-[10px] text-gray-500 font-medium leading-tight">{b.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
