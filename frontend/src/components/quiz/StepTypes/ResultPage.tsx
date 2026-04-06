import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { AUTHORITY_IMAGE_URL, AUTHORITY_NAME, AUTHORITY_TITLE } from '../../../config/authorityImage';
import type { AgeRange } from '../../../types/quiz';

const AREA_LABELS: Record<string, string> = {
  financeiro:      'Prosperidade Financeira',
  relacionamentos: 'Relacionamentos',
  saude:           'Saúde e Vitalidade',
  proposito:       'Propósito e Missão',
  tudo:            'Múltiplas Dimensões',
};

// Score for the triangle per blocked area (out of 100)
const TRIANGLE_SCORES: Record<string, [number, number, number]> = {
  financeiro:      [82, 65, 74],
  relacionamentos: [61, 78, 83],
  saude:           [58, 71, 86],
  proposito:       [74, 83, 62],
  tudo:            [80, 77, 82],
};

const AGE_LABEL: Record<AgeRange, string> = {
  '25-34': '25 aos 34',
  '35-44': '35 aos 44',
  '45-54': '45 aos 54',
  '55+':   '55+',
};

// Generates SVG wave path (30 points) for the blockage intensity chart
function buildWavePath(width: number, height: number, valleys: number[]): string {
  const pts: string[] = [];
  for (let d = 0; d <= 30; d++) {
    const x = (d / 30) * width;
    // Base wave: higher = more blockage
    const base = (height / 2) + (height * 0.38) * Math.cos((d / 30) * 4 * Math.PI + Math.PI * 0.15);
    // Dip on valley days
    const dip = valleys.includes(d) ? -height * 0.25 : 0;
    const y = Math.max(4, Math.min(height - 4, base + dip));
    pts.push(`${d === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

interface ResultPageProps {
  step: number;
  onNext: () => void;
}

export function ResultPage({ onNext }: ResultPageProps) {
  const { diagnosis, responses, destinyNumber, expressionNumber } = useQuizStore();

  // Preload MicroVSL authority image
  useEffect(() => {
    const img = new Image();
    img.src = AUTHORITY_IMAGE_URL;
  }, []);

  if (!diagnosis) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p>Carregando diagnóstico...</p>
      </div>
    );
  }

  const ageRange = (responses.step_2 as AgeRange) ?? '35-44';
  const ageLabel = AGE_LABEL[ageRange] ?? AGE_LABEL['35-44'];
  // Fixed: blocked area is step_5, not step_4
  const blockedArea = (responses.step_5 as string) ?? diagnosis.blocked_area ?? 'financeiro';
  const areaLabel = AREA_LABELS[blockedArea] ?? AREA_LABELS['financeiro'];

  // Personalize scores based on user responses
  // step_9 is a number in flow A (emoji-scale 1-5) but a string in flow B — map to a numeric level
  const BLOCK_LEVEL_MAP: Record<string, number> = { certeza: 5, alta: 4, media: 3, nunca: 2 };
  const rawBlock = responses.step_9;
  const blockLevel: number =
    typeof rawBlock === 'number' ? rawBlock
    : typeof rawBlock === 'string' ? (BLOCK_LEVEL_MAP[rawBlock] ?? 3)
    : 3; // 1-5
  const signsSelected = Array.isArray(responses.step_8) ? (responses.step_8 as string[]).length : 3;
  const hasPatterns = responses.step_6 === 'sim';
  const hasMoneyDrain = responses.step_7 === 'sim';
  const numBonus = Math.round((blockLevel - 3) * 4 + (signsSelected - 3) * 2 + (hasPatterns ? 5 : -3));
  const astBonus = Math.round((blockLevel - 3) * 3 + (signsSelected - 3) * 2 + (hasMoneyDrain ? 5 : -2));
  const lunBonus = Math.round((blockLevel - 3) * 3 + ((destinyNumber ?? 5) % 3) * 2 + ((expressionNumber ?? 4) % 3));

  const [baseNum, baseAst, baseLun] = TRIANGLE_SCORES[blockedArea] ?? TRIANGLE_SCORES['financeiro'];
  const numScore = Math.min(98, Math.max(48, baseNum + numBonus));
  const astScore = Math.min(98, Math.max(48, baseAst + astBonus));
  const lunScore = Math.min(98, Math.max(48, baseLun + lunBonus));

  const favorableDays = diagnosis.favorable_days;

  // Paragraph split
  const paragraphs = diagnosis.diagnosis_text.split('\n\n');

  // Calendar: 30 days, place favorable day markers at roughly 3 spots
  const visibleFavorable = favorableDays >= 15 ? 3 : 2;
  const favorableDayNums = [5, 12, 21].slice(0, visibleFavorable);
  const BLUR_FROM_DAY = 9; // Days >= this get blurred

  // Wave chart: valleys at favorable day positions
  const waveValleyDays = [7, 15, 23];
  const wavePath = buildWavePath(280, 80, waveValleyDays);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-8">

      {/* Authority header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-6 pt-2"
      >
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-full border-2 border-gold-400 overflow-hidden">
            <img src={AUTHORITY_IMAGE_URL} alt={AUTHORITY_NAME} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-800">{AUTHORITY_NAME}</p>
        <span className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5 mt-1">
          {AUTHORITY_TITLE}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 text-center mb-1"
      >
        Seu Diagnóstico Tridimensional
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-gray-400 text-sm mb-6"
      >
        Gerado para mulheres na faixa dos <strong className="text-gold-600">{ageLabel} anos</strong>
      </motion.p>

      {/* Triangle chart with 3 dimension scores */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5"
      >
        <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-wide">
          Triângulo de Desbloqueio — Intensidade por Dimensão
        </p>
        <div className="flex justify-center mb-3">
          <svg width="200" height="165" viewBox="-60 -10 360 175" overflow="visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes rg1{0%,100%{opacity:.55}33%{opacity:1}}
                @keyframes rg2{0%,100%{opacity:.55}66%{opacity:1}}
                @keyframes rg3{0%,100%{opacity:.55}0%{opacity:1}}
                @keyframes re{0%,100%{opacity:.4}50%{opacity:.75}}
                .rg1{animation:rg1 2.4s ease-in-out infinite}
                .rg2{animation:rg2 2.4s ease-in-out infinite}
                .rg3{animation:rg3 2.4s ease-in-out infinite}
                .re{animation:re 2.4s ease-in-out infinite}
              `}</style>
            </defs>
            <polygon points="120,12 210,138 30,138" fill="none" stroke="#D4A855" strokeWidth="1.5" className="re"/>
            <circle cx="120" cy="12"  r="5" fill="#D4A855" className="rg1"/>
            <circle cx="210" cy="138" r="5" fill="#D4A855" className="rg2"/>
            <circle cx="30"  cy="138" r="5" fill="#D4A855" className="rg3"/>
            <text x="120" y="3"   textAnchor="middle" fontSize="10" fill="#C8963E" fontFamily="serif">Numerologia</text>
            <text x="218" y="148" textAnchor="start"  fontSize="10" fill="#C8963E" fontFamily="serif">Astrologia</text>
            <text x="22"  y="148" textAnchor="end"    fontSize="10" fill="#C8963E" fontFamily="serif">Lunar</text>
          </svg>
        </div>

        {/* Score bars */}
        <div className="flex flex-col gap-2">
          {[
            { label: 'Numerologia', score: numScore },
            { label: 'Astrologia',  score: astScore },
            { label: 'Lunar',       score: lunScore },
          ].map(({ label, score }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 text-right flex-shrink-0">{label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #D4A855, #C8963E)' }}
                />
              </div>
              <span className="text-xs font-semibold text-gold-600 w-8 flex-shrink-0">{score}%</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">
          Dimensão predominante: <strong className="text-gold-600">{areaLabel}</strong>
        </p>
      </motion.div>

      {/* Diagnosis text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5"
      >
        {paragraphs.map((para, i) => (
          <p key={i} className={`text-gray-700 leading-relaxed text-sm ${i > 0 ? 'mt-4' : ''}`}>
            {para}
          </p>
        ))}
      </motion.div>

      {/* Wave chart — Intensidade do Bloqueio nos próximos 30 dias */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5 relative overflow-hidden"
      >
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide text-center">
          Intensidade do Bloqueio — próximos 30 dias
        </p>
        <div className="relative">
          <svg width="100%" viewBox="0 0 300 90" preserveAspectRatio="none" className="overflow-visible">
            {/* Gridlines */}
            <line x1="0" y1="45" x2="300" y2="45" stroke="#f0ece6" strokeWidth="1" strokeDasharray="4,4"/>
            {/* Wave path */}
            <path d={wavePath} fill="none" stroke="#D4A855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Valley markers (gold stars) — only first 2-3 visible */}
            {waveValleyDays.map((day, i) => {
              const x = (day / 30) * 280 + (10 / 30) * 280 * 0.5;
              return (
                <g key={i}>
                  <circle cx={x} cy={20} r={5} fill="#D4A855" opacity={0.9}/>
                  <text x={x} y={24} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">★</text>
                </g>
              );
            })}
            {/* Day labels */}
            {[1, 7, 14, 21, 30].map((d) => (
              <text key={d} x={(d / 30) * 280} y={88} textAnchor="middle" fontSize="8" fill="#9ca3af">
                {d}
              </text>
            ))}
          </svg>
          {/* Blur overlay on right 2/3 */}
          <div
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              width: '65%',
              background: 'linear-gradient(to right, transparent, rgba(255,248,240,0.92) 30%, rgba(255,248,240,0.98))',
              backdropFilter: 'blur(3px)',
            }}
          />
          {/* Lock icon over blurred area */}
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="bg-white border border-gold-200 rounded-xl px-3 py-2 text-xs text-gold-700 font-medium shadow-sm text-center">
              🔒 {favorableDays - 2} dias<br/>
              <span className="text-gray-400 font-normal">bloqueados</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          ★ = Dias favoráveis (a trava afrouxa)
        </p>
      </motion.div>

      {/* Calendar preview (blurred) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6 relative overflow-hidden"
      >
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide text-center">
          Calendário de Abundância — 30 dias
        </p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isFavorable = favorableDayNums.includes(day);
            const isBlurred = day >= BLUR_FROM_DAY;
            return (
              <div
                key={day}
                className={`relative h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  isFavorable
                    ? 'bg-gold-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                } ${isBlurred ? 'blur-sm select-none' : ''}`}
              >
                {isFavorable ? '★' : day}
              </div>
            );
          })}
        </div>
        {/* Overlay gradient for blurred section */}
        <div
          className="absolute pointer-events-none rounded-b-2xl"
          style={{
            bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to bottom, transparent, rgba(255,248,240,0.95))',
          }}
        />
        <div className="relative text-center mt-3">
          <p className="text-xs text-gold-700 font-medium">
            🔒 {favorableDays - visibleFavorable} dias favoráveis bloqueados
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="w-full btn-primary py-4 text-base"
      >
        Desbloquear meu Calendário completo →
      </motion.button>
    </div>
  );
}
