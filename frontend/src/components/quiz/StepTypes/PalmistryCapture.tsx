import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../../../store/quizStore';
import { quizService } from '../../../services/quizService';

interface Props {
  step: number;
  onNext: () => void;
}

/** Canvas-based skin-tone heuristic. Returns true if image likely contains a hand. */
function validateHandPhoto(objectUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const MAX = 120;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(true); return; }
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let skin = 0, total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          total++;
          // Skin tone range (covers light to dark complexions)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (
            r > 60 && g > 30 && b > 15 &&
            max - min > 10 &&
            r > b &&
            r > g * 0.7 &&
            r < 255 && g < 230 && b < 210
          ) skin++;
        }
        resolve(total > 0 && skin / total > 0.07);
      } catch {
        resolve(true); // fail open
      }
    };
    img.onerror = () => resolve(true);
    img.src = objectUrl;
  });
}

type UIState = 'idle' | 'validating' | 'invalid' | 'reading';

export function PalmistryCapture({ step, onNext }: Props) {
  const { sessionToken, saveStepResponse, setPalmistrySkipped, setPalmistryPhoto } = useQuizStore();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uiState, setUiState] = useState<UIState>('idle');

  const processFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setUiState('validating');

    const isHand = await validateHandPhoto(url);
    if (!isHand) {
      setUiState('invalid');
      return;
    }

    setUiState('reading');
    setPalmistryPhoto(url);
    setTimeout(() => {
      saveStepResponse(step, 'captured');
      setPalmistrySkipped(false);
      try { quizService.saveStep(sessionToken!, step, 'captured'); } catch { /* continue */ }
      onNext();
    }, 3200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected after an invalid attempt
    e.target.value = '';
    processFile(file);
  };

  const handleRetry = () => {
    setPreview(null);
    setUiState('idle');
  };

  const handleSkip = () => {
    saveStepResponse(step, 'skipped');
    setPalmistrySkipped(true);
    setPalmistryPhoto(null);
    try { quizService.saveStep(sessionToken!, step, 'skipped'); } catch { /* continue */ }
    onNext();
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

      {/* Hidden file inputs */}
      <input ref={cameraRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={galleryRef} type="file" accept="image/*"                        className="hidden" onChange={handleFileChange} />

      <div className="max-w-md w-full text-center relative z-10">
        <AnimatePresence mode="wait">

          {/* IDLE — initial prompt */}
          {uiState === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🤚
              </motion.div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#D4A855' }}>O mais revelador</p>
              <h2 className="text-2xl md:text-3xl font-serif mb-3 leading-snug" style={{ color: '#fff8f0' }}>
                A linha da sua mão esconde seu Código de Abundância.
              </h2>
              <p className="text-sm mb-8" style={{ color: '#a89070' }}>
                Abra a palma direita voltada para cima e tire uma foto clara.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  onClick={() => cameraRef.current?.click()}
                  className="w-full py-4 text-lg font-bold rounded-xl"
                  style={{ background: '#D4A855', color: '#0a0a14' }}
                >
                  📸 Tirar foto agora
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  onClick={() => galleryRef.current?.click()}
                  className="w-full py-3 text-base font-semibold rounded-xl border"
                  style={{ borderColor: '#D4A855', color: '#D4A855', background: 'transparent' }}
                >
                  🖼️ Escolher da galeria
                </motion.button>
                <button onClick={handleSkip} className="text-xs underline mt-1" style={{ color: '#5a4a3a' }}>
                  Pular esta etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* VALIDATING */}
          {uiState === 'validating' && preview && (
            <motion.div key="validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <img src={preview} alt="sua mão" className="w-48 h-48 object-cover rounded-2xl mx-auto mb-4 opacity-60" style={{ filter: 'blur(1px)' }} />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-sm font-medium"
                style={{ color: '#D4A855' }}
              >
                Verificando imagem...
              </motion.p>
            </motion.div>
          )}

          {/* INVALID — not a hand */}
          {uiState === 'invalid' && (
            <motion.div key="invalid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {preview && (
                <img src={preview} alt="imagem inválida" className="w-40 h-40 object-cover rounded-2xl mx-auto mb-4 opacity-40 grayscale" />
              )}
              <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(200,50,50,0.15)', border: '1px solid rgba(200,80,80,0.4)' }}>
                <p className="text-lg mb-1">❌</p>
                <p className="text-sm font-semibold mb-1" style={{ color: '#ff8080' }}>
                  Não conseguimos identificar uma mão nessa imagem.
                </p>
                <p className="text-xs" style={{ color: '#a89070' }}>
                  Abra a palma direita voltada para cima, boa iluminação, sem luvas.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full py-4 text-lg font-bold rounded-xl"
                  style={{ background: '#D4A855', color: '#0a0a14' }}
                >
                  Tentar novamente
                </button>
                <button onClick={handleSkip} className="text-xs underline mt-1" style={{ color: '#5a4a3a' }}>
                  Pular esta etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* READING — valid hand, animating */}
          {uiState === 'reading' && preview && (
            <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative w-full max-w-xs mx-auto">
                <img src={preview} alt="sua mão" className="w-full rounded-2xl opacity-70" style={{ filter: 'blur(1px)' }} />
                {/* SVG palm lines overlay */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 280" fill="none">
                  <motion.path d="M60 240 Q80 180 75 120 Q72 80 90 50" stroke="#D4A855" strokeWidth="1.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} />
                  <motion.path d="M40 160 Q90 150 140 155 Q170 158 185 145" stroke="#C8963E" strokeWidth="1.2" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
                  <motion.path d="M50 200 Q100 190 150 195 Q175 197 190 185" stroke="#D4A855" strokeWidth="1" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }} />
                  <motion.path d="M100 240 Q105 200 110 160 Q115 130 105 100" stroke="#C8963E" strokeWidth="0.8" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.0 }} />
                </svg>
              </div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-center mt-4 text-sm font-medium"
                style={{ color: '#D4A855' }}
              >
                Lendo as linhas...
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
