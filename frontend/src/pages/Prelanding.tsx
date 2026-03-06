import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../store/quizStore'

function Prelanding() {
  const [loading, setLoading] = useState(false)
  const { startQuiz } = useQuizStore()
  const navigate = useNavigate()

  const handleStart = async () => {
    setLoading(true)
    try {
      const { session_token } = await quizService.startQuiz()
      startQuiz(session_token)
      navigate('/quiz')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Starfield background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#D4A855" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#D4A855" stopOpacity="0" />
          </radialGradient>
          <style>{`
            @keyframes shimmer1 { 0%,100%{opacity:0.55} 33%{opacity:1} }
            @keyframes shimmer2 { 0%,100%{opacity:0.45} 66%{opacity:1} }
            @keyframes shimmer3 { 0%,100%{opacity:0.5}  0%{opacity:1}  }
            .tri-dot-1 { animation: shimmer1 2.4s ease-in-out infinite; }
            .tri-dot-2 { animation: shimmer2 2.4s ease-in-out infinite; }
            .tri-dot-3 { animation: shimmer3 2.4s ease-in-out infinite; }
            .tri-line  { animation: shimmer1 2.4s ease-in-out infinite; }
          `}</style>
        </defs>
        <rect x="0" y="0" width="1440" height="900" fill="url(#centerGlow)" />

        {/* Dot stars */}
        <circle cx="72"  cy="90"  r="2"   fill="#D4A855" opacity="0.5" />
        <circle cx="173" cy="225" r="1.5" fill="#C8963E" opacity="0.55" />
        <circle cx="288" cy="72"  r="2.5" fill="#D4A855" opacity="0.3" />
        <circle cx="115" cy="405" r="1.5" fill="#D4A855" opacity="0.45" />
        <circle cx="216" cy="585" r="2"   fill="#C8963E" opacity="0.4" />
        <circle cx="360" cy="720" r="1.5" fill="#D4A855" opacity="0.45" />
        <circle cx="43"  cy="630" r="2.5" fill="#C8963E" opacity="0.25" />
        <circle cx="1267" cy="108" r="2"  fill="#D4A855" opacity="0.45" />
        <circle cx="1368" cy="270" r="1.5" fill="#C8963E" opacity="0.5" />
        <circle cx="1181" cy="180" r="2.5" fill="#D4A855" opacity="0.3" />
        <circle cx="1325" cy="495" r="2"  fill="#C8963E" opacity="0.4" />
        <circle cx="1123" cy="675" r="1.5" fill="#D4A855" opacity="0.5" />
        <circle cx="1382" cy="720" r="2.5" fill="#C8963E" opacity="0.3" />
        <circle cx="1224" cy="810" r="1.5" fill="#D4A855" opacity="0.45" />
        <circle cx="504"  cy="45"  r="1.5" fill="#C8963E" opacity="0.5" />
        <circle cx="720"  cy="27"  r="2"  fill="#D4A855" opacity="0.4" />
        <circle cx="936"  cy="63"  r="1.5" fill="#C8963E" opacity="0.45" />
        <circle cx="648"  cy="828" r="2"  fill="#D4A855" opacity="0.4" />
        <circle cx="864"  cy="855" r="1.5" fill="#C8963E" opacity="0.5" />
        <circle cx="1037" cy="792" r="2.5" fill="#D4A855" opacity="0.3" />
        <circle cx="432"  cy="450" r="1.5" fill="#C8963E" opacity="0.2" />
        <circle cx="1008" cy="360" r="1.5" fill="#D4A855" opacity="0.2" />

        {/* 4-pointed star — top left */}
        <path d="M115,135 L118,148 L115,161 L112,148 Z" fill="#D4A855" opacity="0.5" />
        <path d="M102,148 L115,151 L128,148 L115,145 Z" fill="#D4A855" opacity="0.5" />
        <circle cx="115" cy="148" r="2.5" fill="#D4A855" opacity="0.65" />

        {/* 4-pointed star — top right */}
        <path d="M1325,170 L1328,183 L1325,196 L1322,183 Z" fill="#C8963E" opacity="0.5" />
        <path d="M1312,183 L1325,186 L1338,183 L1325,180 Z" fill="#C8963E" opacity="0.5" />
        <circle cx="1325" cy="183" r="2.5" fill="#C8963E" opacity="0.65" />

        {/* 4-pointed star — bottom left */}
        <path d="M144,756 L147,769 L144,782 L141,769 Z" fill="#D4A855" opacity="0.4" />
        <path d="M131,769 L144,772 L157,769 L144,766 Z" fill="#D4A855" opacity="0.4" />
        <circle cx="144" cy="769" r="2" fill="#D4A855" opacity="0.55" />

        {/* 4-pointed star — bottom right */}
        <path d="M1296,720 L1299,733 L1296,746 L1293,733 Z" fill="#C8963E" opacity="0.4" />
        <path d="M1283,733 L1296,736 L1309,733 L1296,730 Z" fill="#C8963E" opacity="0.4" />
        <circle cx="1296" cy="733" r="2" fill="#C8963E" opacity="0.55" />
      </svg>

      {/* Main content */}
      <div className="max-w-2xl mx-auto text-center relative z-10 py-12">

        {/* Crescent moon + stars hero decoration */}
        <div className="flex justify-center mb-6">
          <svg width="150" height="120" viewBox="0 0 150 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="70" cy="62" r="38" fill="#D4A855" opacity="0.18" />
            <circle cx="86" cy="54" r="30" fill="#FFF8F0" />
            <path d="M20,28 L22.5,37 L20,46 L17.5,37 Z" fill="#D4A855" opacity="0.8" />
            <path d="M11,37 L20,39.5 L29,37 L20,34.5 Z" fill="#D4A855" opacity="0.8" />
            <circle cx="20" cy="37" r="2" fill="#D4A855" opacity="0.9" />
            <path d="M122,20 L124.5,29 L122,38 L119.5,29 Z" fill="#C8963E" opacity="0.8" />
            <path d="M113,29 L122,31.5 L131,29 L122,26.5 Z" fill="#C8963E" opacity="0.8" />
            <circle cx="122" cy="29" r="2" fill="#C8963E" opacity="0.9" />
            <circle cx="16"  cy="66"  r="2.5" fill="#D4A855" opacity="0.45" />
            <circle cx="133" cy="54"  r="1.5" fill="#C8963E" opacity="0.55" />
            <circle cx="8"   cy="48"  r="1.5" fill="#D4A855" opacity="0.35" />
            <circle cx="140" cy="80"  r="1.5" fill="#D4A855" opacity="0.35" />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-gold-600 mb-5 leading-tight">
          Seu Bloqueio Financeiro Tem Nome.<br />E Tem Data de Validade.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
          O Diagnóstico Tridimensional da Mestra Renata cruza numerologia, astrologia e ciclos lunares
          para identificar <strong>O QUE</strong> trava sua prosperidade — e <strong>QUANDO</strong> a trava afrouxa.
          Mais de 3.800 mulheres já fizeram. Leva 2 minutos.
        </p>

        {/* Mestra Renata card */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar placeholder with verification badge */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full border-2 border-gold-600 overflow-hidden">
              <img src="/FotoRenata.png" alt="Mestra Renata Alves" className="w-full h-full object-cover" />
            </div>
            {/* Blue verification badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-800">Mestra Renata Alves</p>
          <span className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mt-1">
            Numeróloga e Terapeuta Vibracional
          </span>
        </div>

        {/* Triângulo de Desbloqueio — animated */}
        <div className="flex flex-col items-center mb-8">
          <svg width="240" height="140" viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes glow1 { 0%,100%{opacity:0.5;r:3} 33%{opacity:1;r:5} }
                @keyframes glow2 { 0%,100%{opacity:0.5;r:3} 66%{opacity:1;r:5} }
                @keyframes glow3 { 0%,100%{opacity:0.5;r:3} 0%,99%{opacity:0.5;r:3} 50%{opacity:1;r:5} }
                @keyframes fadeEdge { 0%,100%{opacity:0.4} 50%{opacity:0.75} }
                .g1 { animation: glow1 2.4s ease-in-out infinite; }
                .g2 { animation: glow2 2.4s ease-in-out infinite; }
                .g3 { animation: glow3 2.4s ease-in-out infinite; }
                .ge { animation: fadeEdge 2.4s ease-in-out infinite; }
              `}</style>
            </defs>
            {/* Triangle edges */}
            <polygon points="120,12 210,125 30,125" fill="none" stroke="#D4A855" strokeWidth="1.5" className="ge" />
            {/* Vertex dots */}
            <circle cx="120" cy="12"  r="4" fill="#D4A855" className="g1" />
            <circle cx="210" cy="125" r="4" fill="#D4A855" className="g2" />
            <circle cx="30"  cy="125" r="4" fill="#D4A855" className="g3" />
            {/* Labels */}
            <text x="120" y="6"   textAnchor="middle" fontSize="9" fill="#C8963E" fontFamily="serif">Numerologia</text>
            <text x="222" y="132" textAnchor="start"  fontSize="9" fill="#C8963E" fontFamily="serif">Astrologia</text>
            <text x="18"  y="132" textAnchor="end"    fontSize="9" fill="#C8963E" fontFamily="serif">Lunar</text>
          </svg>
          <p className="text-xs text-gray-500 -mt-2">Triângulo de Desbloqueio</p>
        </div>

        {/* Social proof */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full shadow px-5 py-2 mb-8 border border-amber-100">
          <span className="text-gold-600 font-bold text-sm">+3.847</span>
          <span className="text-gray-600 text-sm">diagnósticos realizados</span>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Descobrir o nome do meu bloqueio →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Prelanding
