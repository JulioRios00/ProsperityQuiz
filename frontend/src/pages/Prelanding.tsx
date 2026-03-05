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
      <div className="max-w-4xl mx-auto text-center relative z-10">

        {/* Crescent moon + stars hero decoration */}
        <div className="flex justify-center mb-8">
          <svg width="150" height="120" viewBox="0 0 150 120" xmlns="http://www.w3.org/2000/svg">
            {/* Moon body */}
            <circle cx="70" cy="62" r="38" fill="#D4A855" opacity="0.18" />
            <circle cx="86" cy="54" r="30" fill="#FFF8F0" />

            {/* 4-pointed star — left */}
            <path d="M20,28 L22.5,37 L20,46 L17.5,37 Z" fill="#D4A855" opacity="0.8" />
            <path d="M11,37 L20,39.5 L29,37 L20,34.5 Z" fill="#D4A855" opacity="0.8" />
            <circle cx="20" cy="37" r="2" fill="#D4A855" opacity="0.9" />

            {/* 4-pointed star — right */}
            <path d="M122,20 L124.5,29 L122,38 L119.5,29 Z" fill="#C8963E" opacity="0.8" />
            <path d="M113,29 L122,31.5 L131,29 L122,26.5 Z" fill="#C8963E" opacity="0.8" />
            <circle cx="122" cy="29" r="2" fill="#C8963E" opacity="0.9" />

            {/* Small accent dots */}
            <circle cx="16"  cy="66"  r="2.5" fill="#D4A855" opacity="0.45" />
            <circle cx="133" cy="54"  r="1.5" fill="#C8963E" opacity="0.55" />
            <circle cx="8"   cy="48"  r="1.5" fill="#D4A855" opacity="0.35" />
            <circle cx="140" cy="80"  r="1.5" fill="#D4A855" opacity="0.35" />
            <circle cx="38"  cy="96"  r="1"   fill="#C8963E" opacity="0.4" />
            <circle cx="112" cy="100" r="1"   fill="#D4A855" opacity="0.4" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl text-gold-600 mb-6">
          Descubra o Bloqueio Invisível que Trava sua Prosperidade
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Mais de 3.800 mulheres já identificaram o padrão que sabotava sua vida financeira — e descobriram QUANDO agir para destravar
        </p>

        <div className="mb-8">
          <div className="inline-block bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">
              ✓ Numeróloga e Terapeuta Vibracional
            </p>
            <p className="text-gold-600 font-medium">
              +3.847 pessoas já fizeram o Diagnóstico Tridimensional
            </p>
          </div>
        </div>

        {/* Sacred triangle ornament — Triângulo de Desbloqueio */}
        <div className="flex justify-center mb-6">
          <svg width="210" height="52" viewBox="0 0 210 52" xmlns="http://www.w3.org/2000/svg">
            <line x1="0"   y1="26" x2="78"  y2="26" stroke="#D4A855" strokeWidth="1" opacity="0.45" />
            <polygon points="105,5 125,42 85,42" fill="none" stroke="#D4A855" strokeWidth="1.5" opacity="0.65" />
            <circle cx="105" cy="5"  r="2.5" fill="#D4A855" opacity="0.7" />
            <circle cx="125" cy="42" r="2.5" fill="#D4A855" opacity="0.7" />
            <circle cx="85"  cy="42" r="2.5" fill="#D4A855" opacity="0.7" />
            <line x1="132" y1="26" x2="210" y2="26" stroke="#D4A855" strokeWidth="1" opacity="0.45" />
          </svg>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="btn-primary text-lg px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando...' : 'Descobrir meu bloqueio →'}
        </button>
      </div>
    </div>
  )
}

export default Prelanding
