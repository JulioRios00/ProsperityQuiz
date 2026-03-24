import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';

interface Props {
  step: number;
  onNext: () => void;
}

export function PalmistryCapture({ step, onNext }: Props) {
  const { sessionToken, saveStepResponse, setPalmistrySkipped } = useQuizStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setShowOverlay(true);
    // After 3s overlay, proceed
    setTimeout(() => {
      saveStepResponse(step, 'captured');
      setPalmistrySkipped(false);
      try { quizService.saveStep(sessionToken!, step, 'captured'); } catch { /* continue */ }
      onNext();
    }, 3200);
  };

  const handleSkip = () => {
    saveStepResponse(step, 'skipped');
    setPalmistrySkipped(true);
    try { quizService.saveStep(sessionToken!, step, 'skipped'); } catch { /* continue */ }
    onNext(); // go to step 11 — QuizFlow useEffect will auto-skip to step 12
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#0a0a14' }}
    >
      {/* Golden particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: '#D4A855', left: `${8 + i * 7.5}%`, top: `${10 + (i % 4) * 20}%` }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -20, 0] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {showOverlay && preview ? (
        <div className="relative w-full max-w-xs mx-auto">
          <img src={preview} alt="sua mão" className="w-full rounded-2xl opacity-70" style={{ filter: 'blur(1px)' }} />
          {/* SVG lines overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <style>{`
                @keyframes drawLine { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
                .palm-line { stroke-dasharray: 300; animation: drawLine 1s ease-out forwards; }
              `}</style>
            </defs>
            {/* Heart line */}
            <path className="palm-line" d="M40,80 Q120,60 200,90 Q240,100 270,80" stroke="#D4A855" strokeWidth="2" fill="none" style={{ animationDelay: '0s' }} />
            <text x="280" y="80" fill="#D4A855" fontSize="10" fontFamily="serif">Abundância</text>
            {/* Head line */}
            <path className="palm-line" d="M35,140 Q130,130 220,160 Q250,168 270,155" stroke="#C8963E" strokeWidth="2" fill="none" style={{ animationDelay: '0.4s' }} />
            <text x="275" y="155" fill="#C8963E" fontSize="10" fontFamily="serif">Bloqueio</text>
            {/* Life line */}
            <path className="palm-line" d="M120,70 Q80,160 90,280 Q95,340 110,380" stroke="#D4A855" strokeWidth="2" fill="none" style={{ animationDelay: '0.8s' }} />
            <text x="5" y="280" fill="#D4A855" fontSize="10" fontFamily="serif">Destino</text>
            {/* Fate line */}
            <path className="palm-line" d="M150,380 Q148,280 150,180 Q152,120 155,80" stroke="#C8963E" strokeWidth="1.5" fill="none" style={{ animationDelay: '1.2s' }} />
            <text x="160" y="75" fill="#C8963E" fontSize="10" fontFamily="serif">Sucesso</text>
          </svg>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-center mt-4 text-sm font-medium"
            style={{ color: '#D4A855' }}
          >
            Lendo as linhas...
          </motion.p>
        </div>
      ) : (
        <div className="max-w-md w-full text-center relative z-10">
          {/* Palm icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🤚
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#D4A855' }}>O mais revelador</p>
            <h2 className="text-2xl md:text-3xl font-serif mb-3 leading-snug" style={{ color: '#fff8f0' }}>
              A linha da sua mão esconde seu Código de Abundância.
            </h2>
            <p className="text-sm" style={{ color: '#a89070' }}>
              Tire uma foto da sua mão direita para revelar.
            </p>
          </motion.div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCapture}
          />

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => fileRef.current?.click()}
            className="w-full py-4 text-lg font-bold rounded-xl mb-4"
            style={{ background: '#D4A855', color: '#0a0a14' }}
          >
            Revelar meu Código ✨
          </motion.button>

          <button
            onClick={handleSkip}
            className="text-xs underline"
            style={{ color: '#5a4a3a' }}
          >
            Pular esta etapa
          </button>
        </div>
      )}
    </div>
  );
}
