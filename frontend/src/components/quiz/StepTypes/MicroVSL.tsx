import { motion } from 'framer-motion';

interface MicroVSLProps {
  step: number;
  onNext: () => void;
}

export function MicroVSL({ onNext }: MicroVSLProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-gold-500 font-medium uppercase tracking-wide mb-2">
          Mensagem de Mestra Renata Alves
        </p>
        <h2 className="text-2xl md:text-3xl font-serif text-gold-600">
          Como usar sua janela de {' '}
          <span className="underline decoration-gold-400">transformação</span>
        </h2>
      </motion.div>

      {/* Video placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video mb-6 shadow-lg"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 rounded-full bg-gold-500/80 flex items-center justify-center mb-3">
            <span className="text-2xl ml-1">▶</span>
          </div>
          <p className="text-sm opacity-70">Vídeo em breve</p>
        </div>
        {/* Gradient overlay for aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/40 to-gray-900/80" />
      </motion.div>

      {/* Key points */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-left space-y-3 mb-8"
      >
        {[
          'Por que a maioria das técnicas falha — e o que realmente funciona',
          'Como o Triângulo de Desbloqueio age diretamente na raiz do padrão',
          'Como identificar e usar seus dias favoráveis com precisão',
        ].map((point, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
            <span className="text-gold-500 font-bold mt-0.5">✦</span>
            <p className="text-gray-700 text-sm">{point}</p>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onNext}
        className="w-full btn-primary py-4 text-base"
      >
        Quero destravar agora →
      </motion.button>
    </div>
  );
}
