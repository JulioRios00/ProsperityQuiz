import { useState } from 'react';
import { motion } from 'framer-motion';
import { AUTHORITY_IMAGE_URL, AUTHORITY_NAME, AUTHORITY_TITLE } from '../../../config/authorityImage';

interface MicroVSLProps {
  step: number;
  onNext: () => void;
}

export function MicroVSL({ onNext }: MicroVSLProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-gold-500 font-medium uppercase tracking-wide mb-6"
      >
        Uma mensagem especial para você
      </motion.p>

      {/* Split layout: photo + message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 border border-gray-100"
      >
        <div className="md:flex">
          {/* Portrait */}
          <div className="md:w-2/5 relative bg-gradient-to-b from-gold-50 to-cream-100 flex items-end justify-center min-h-56">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold-300 border-t-gold-500 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={AUTHORITY_IMAGE_URL}
              alt={AUTHORITY_NAME}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-64 md:h-full object-cover object-top transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>

          {/* Message */}
          <div className="md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <p className="font-serif text-lg text-gold-600 mb-1">{AUTHORITY_NAME}</p>
              <p className="text-xs text-gray-400 mb-4">{AUTHORITY_TITLE}</p>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Depois de acompanhar mais de 3.800 mulheres, percebi que o problema
                nunca foi esforço, vontade ou inteligência.{' '}
                <strong>Foi sempre o bloqueio energético agindo na sombra.</strong>"
              </p>

              <p className="text-gray-700 text-sm leading-relaxed">
                "Quando você conhece seu padrão e age na janela certa, a transformação
                acontece de forma natural — sem forçar, sem lutar contra si mesma."
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                Numeróloga com 18 anos de experiência · 3.847 diagnósticos realizados
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key points */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-2 mb-7"
      >
        {[
          'Por que a maioria das técnicas falha — e o que realmente funciona',
          'Como o Triângulo de Desbloqueio age diretamente na raiz do padrão',
          'Como usar seus dias favoráveis com precisão para agir no timing certo',
        ].map((point, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
            <span className="text-gold-500 font-bold mt-0.5 flex-shrink-0">✦</span>
            <p className="text-gray-700 text-sm">{point}</p>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        className="w-full btn-primary py-4 text-base"
      >
        Quero destravar agora →
      </motion.button>
    </div>
  );
}
