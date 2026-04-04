import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';

interface Props {
  onNext: () => void;
  variant?: string;
}

const STEPS = [
  'Identificando Linha do Destino Financeiro...',
  'Medindo comprimento da Linha de Abundância...',
  'Analisando interseção com Linha do Bloqueio...',
  'Cruzando com seu Número do Destino...',
  'Diagnóstico Palm-Numerológico completo! ✨',
];

interface PalmReading {
  label: string;
  lineDominant: string;
  blockFound: string;
  opportunity: string;
  detail: string;
}

const PALM_READINGS: Record<number, PalmReading> = {
  1: {
    label: 'Abertura',
    lineDominant: 'Linha da Vida longa e profunda',
    blockFound: 'Bloqueio de auto-sabotagem nos momentos de pico',
    opportunity: 'Você tem força vital acima da média — o bloqueio é comportamental, não energético.',
    detail: 'Sua Linha da Vida indica energia e resistência excepcionais. O problema não é falta de força — é um padrão de recuo justo quando a prosperidade está ao alcance. Isso é desbloqueável.',
  },
  2: {
    label: 'Expansão',
    lineDominant: 'Linha do Coração bifurcada',
    blockFound: 'Bloqueio emocional ligado a merecimento',
    opportunity: 'Sua capacidade afetiva é um ativo financeiro subutilizado.',
    detail: 'A bifurcação na sua Linha do Coração revela uma tensão entre dar e receber. Você sabe gerar valor para os outros mas inconscientemente bloqueia o retorno. Esse padrão tem solução clara.',
  },
  3: {
    label: 'Transformação',
    lineDominant: 'Linha da Cabeça longa e inclinada',
    blockFound: 'Excesso de análise — paralisia por perfeccionismo',
    opportunity: 'Mente analítica poderosa, basta direcionar para ação.',
    detail: 'Sua Linha da Cabeça é uma das mais longas que analisamos — isso indica inteligência estratégica. O problema é que você pensa mais do que age nos dias certos. O calendário vai resolver isso.',
  },
  4: {
    label: 'Abundância',
    lineDominant: 'Linha do Destino central e contínua',
    blockFound: 'Bloqueio de timing — ação nos dias errados',
    opportunity: 'Sua trajetória tem propósito claro. Falta apenas sincronizar.',
    detail: 'A presença de uma Linha do Destino forte e contínua é rara — indica que você tem um caminho definido. O bloqueio não é de propósito, é de timing. Cada ação no dia errado custa o dobro.',
  },
  5: {
    label: 'Renovação',
    lineDominant: 'Linhas de influência múltiplas',
    blockFound: 'Dispersão de energia — muitas portas abertas ao mesmo tempo',
    opportunity: 'Capacidade de conexão e influência acima da média.',
    detail: 'As múltiplas linhas de influência na sua palma indicam uma pessoa magnética, com capacidade de mover pessoas e recursos. O problema é dispersão: muita energia em direções diferentes. Foco nos dias favoráveis muda tudo.',
  },
  6: {
    label: 'Fluxo',
    lineDominant: 'Linha de Mercúrio (comunicação) visível',
    blockFound: 'Bloqueio na comunicação do próprio valor',
    opportunity: 'Dom natural para vender, negociar e persuadir quando desbloqueada.',
    detail: 'A presença da Linha de Mercúrio revela habilidade inata para comunicação e negócios. Mas há um bloqueio específico: dificuldade em comunicar seu próprio valor sem sentir culpa. Isso explica por que você aceita menos do que merece.',
  },
  7: {
    label: 'Manifestação',
    lineDominant: 'Monte de Vênus desenvolvido',
    blockFound: 'Bloqueio de prazer e recompensa — dificuldade em receber',
    opportunity: 'Alta capacidade criativa e de realização quando em fluxo.',
    detail: 'O Monte de Vênus desenvolvido na sua palma indica uma pessoa com grande capacidade de criar e realizar. Porém, há um condicionamento profundo que associa prazer e recompensa com culpa. Desbloqueando isso, o fluxo financeiro muda rapidamente.',
  },
  8: {
    label: 'Desbloqueio',
    lineDominant: 'Cruzamento entre Linha do Coração e Cabeça',
    blockFound: 'Conflito entre emoção e razão nas decisões financeiras',
    opportunity: 'Quando integradas, intuição e lógica formam uma combinação rara.',
    detail: 'O cruzamento entre as linhas do Coração e da Cabeça indica uma pessoa que toma decisões emocionais em situações que pedem lógica, e vice-versa. Isso gera inconsistência financeira. O diagnóstico vai mapear exatamente quando esse conflito surge.',
  },
  9: {
    label: 'Prosperidade',
    lineDominant: 'Linha do Sol (sucesso) presente',
    blockFound: 'Bloqueio de visibilidade — medo do sucesso pleno',
    opportunity: 'Potencial de reconhecimento e sucesso financeiro elevado.',
    detail: 'A presença da Linha do Sol é o sinal mais promissor que existe em uma palma — indica potencial de sucesso e reconhecimento. Mas há um paradoxo: um medo inconsciente de se tornar completamente visível. Quando esse bloqueio é removido, os resultados são rápidos.',
  },
};

export function PalmistryAnalysis({ onNext, variant }: Props) {
  const { destinyNumber, expressionNumber, palmistryPhotoUrl } = useQuizStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const total = STEPS.length;
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < total - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(Math.round(((currentStepIdx + 1) / STEPS.length) * 100));
  }, [currentStepIdx]);

  useEffect(() => {
    if (currentStepIdx === STEPS.length - 1) {
      const t = setTimeout(() => setDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [currentStepIdx]);

  const circumference = 2 * Math.PI * 52;

  const codeNumber = destinyNumber && expressionNumber
    ? ((destinyNumber * 3 + expressionNumber * 7) % 9) + 1
    : destinyNumber
      ? ((destinyNumber * 4) % 9) + 1
      : 7;

  const reading = PALM_READINGS[codeNumber] ?? PALM_READINGS[7];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a1228 50%, #0d0a18 100%)' }}
    >
      {/* Hand photo as background */}
      {palmistryPhotoUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${palmistryPhotoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            filter: 'blur(8px)',
          }}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-sm w-full relative z-10">
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: '#D4A855' }}>
          {variant === 'b' ? 'Analisando sua leitura de mão...' : 'Análise Palm-Numerológica'}
        </p>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(212,168,85,0.15)" strokeWidth="4" />
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="#D4A855"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <span className="absolute text-2xl font-bold" style={{ color: '#D4A855' }}>{progress}%</span>
        </div>

        {/* Steps list */}
        <div className="space-y-3 mb-8 text-left">
          {STEPS.map((s, i) => {
            const label = i === 3 ? s.replace('...', ` (${destinyNumber ?? '?'})...`) : s;
            const isDone = i < currentStepIdx;
            const isActive = i === currentStepIdx;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentStepIdx ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm" style={{ color: isDone ? '#D4A855' : isActive ? '#fff8f0' : '#5a4a3a' }}>
                  {isDone ? '✓' : isActive ? '◉' : '○'}
                </span>
                <span className="text-sm" style={{ color: isDone ? '#D4A855' : isActive ? '#fff8f0' : '#5a4a3a' }}>
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Result card */}
        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div
              className="rounded-xl p-5 mb-5 text-left"
              style={{ background: 'rgba(212,168,85,0.08)', border: '1px solid rgba(212,168,85,0.3)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: '#D4A855' }}>
                  Código de Abundância revelado
                </p>
                <span className="text-2xl font-bold" style={{ color: '#D4A855' }}>{codeNumber}</span>
              </div>

              <p className="text-xs mb-1" style={{ color: '#a89070' }}>
                Vibração predominante:{' '}
                <strong style={{ color: '#D4A855' }}>{reading.label}</strong>
              </p>
              <p className="text-xs mb-3" style={{ color: '#a89070' }}>
                Linha dominante:{' '}
                <strong style={{ color: '#fff8f0' }}>{reading.lineDominant}</strong>
              </p>

              <div
                className="rounded-lg p-3 mb-3"
                style={{ background: 'rgba(200,50,50,0.12)', border: '1px solid rgba(200,80,80,0.25)' }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: '#ff9090' }}>🔒 Bloqueio identificado</p>
                <p className="text-xs" style={{ color: '#c89080' }}>{reading.blockFound}</p>
              </div>

              <div
                className="rounded-lg p-3 mb-3"
                style={{ background: 'rgba(50,150,80,0.12)', border: '1px solid rgba(80,180,100,0.25)' }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: '#80d890' }}>✨ Oportunidade oculta</p>
                <p className="text-xs" style={{ color: '#80c090' }}>{reading.opportunity}</p>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: '#a89070' }}>
                {reading.detail}
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              className="w-full py-4 text-base font-bold rounded-xl"
              style={{ background: '#D4A855', color: '#0a0a14' }}
            >
              Ver Diagnóstico Completo →
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
