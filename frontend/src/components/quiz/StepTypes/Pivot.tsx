import { motion } from 'framer-motion';

interface PivotProps {
  step: number;
  onNext: () => void;
}

export function Pivot({ onNext }: PivotProps) {
  return (
    <div className="max-w-lg mx-auto px-4 text-center">
      {/* Animated Triângulo de Desbloqueio */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <svg
          width="220"
          height="180"
          viewBox="-60 -10 360 175"
          overflow="visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              @keyframes seqGlow1 {
                0%,100%   { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
                0%,33%    { r:8; opacity:1;   filter:drop-shadow(0 0 8px #D4A855); }
                34%,99%   { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
              }
              @keyframes seqGlow2 {
                0%,33%    { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
                34%,66%   { r:8; opacity:1;   filter:drop-shadow(0 0 8px #D4A855); }
                67%,100%  { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
              }
              @keyframes seqGlow3 {
                0%,66%    { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
                67%,99%   { r:8; opacity:1;   filter:drop-shadow(0 0 8px #D4A855); }
                100%      { r:4; opacity:0.5; filter:drop-shadow(0 0 0px #D4A855); }
              }
              @keyframes edgeFade { 0%,100%{opacity:0.4} 50%{opacity:0.75} }
              .v1 { animation: seqGlow1 3s ease-in-out infinite; }
              .v2 { animation: seqGlow2 3s ease-in-out infinite; }
              .v3 { animation: seqGlow3 3s ease-in-out infinite; }
              .edge { animation: edgeFade 3s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* Triangle edges */}
          <polygon
            points="120,12 210,138 30,138"
            fill="none"
            stroke="#D4A855"
            strokeWidth="1.5"
            className="edge"
          />

          {/* Vertex 1 — Numerologia (top) */}
          <circle cx="120" cy="12" r="4" fill="#D4A855" className="v1" />
          <text x="120" y="3" textAnchor="middle" fontSize="11" fill="#C8963E" fontFamily="serif">
            Numerologia
          </text>

          {/* Vertex 2 — Astrologia (bottom-right) */}
          <circle cx="210" cy="138" r="4" fill="#D4A855" className="v2" />
          <text x="218" y="150" textAnchor="start" fontSize="11" fill="#C8963E" fontFamily="serif">
            Astrologia
          </text>

          {/* Vertex 3 — Lunar (bottom-left) */}
          <circle cx="30" cy="138" r="4" fill="#D4A855" className="v3" />
          <text x="22" y="150" textAnchor="end" fontSize="11" fill="#C8963E" fontFamily="serif">
            Lunar
          </text>
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-serif text-gold-600 mb-5"
      >
        Seu padrão tem nome. E tem data de validade.
      </motion.h2>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-700 text-base leading-relaxed mb-8"
      >
        O Triângulo de Desbloqueio cruza 3 dimensões — numerologia pessoal, mapa astral e ciclos lunares —
        para identificar <strong>EXATAMENTE</strong> onde está o bloqueio e, mais importante,{' '}
        <strong>QUANDO</strong> ele enfraquece. Nos seus dias favoráveis, a trava afrouxa. É nesses dias
        que você precisa agir.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onNext}
        className="btn-primary px-10 py-4 text-base"
      >
        Ver meu diagnóstico →
      </motion.button>
    </div>
  );
}
