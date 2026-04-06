import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../store/quizStore'
import { useFacebookPixels } from '../hooks/useFacebookPixels'

const PIXELS_A = ['1899887307317878', '25534330632909821']

interface PrelandingProps {
  variant?: 'a' | 'b'
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function Prelanding({ variant }: PrelandingProps) {
  const [loading, setLoading] = useState(false)
  const scriptLoadedRef = useRef(false)

  // Fire Meta Pixels only for the A variant (not the default / route)
  useFacebookPixels(variant === 'a' ? PIXELS_A : [])

  useEffect(() => {
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const s = document.createElement('script')
      s.src = 'https://scripts.converteai.net/859d3a9a-adcf-4da6-86a3-43be35f0e474/players/69cc705f9a29533f270b1d5f/v4/player.js'
      s.async = true
      document.head.appendChild(s)
    }
  }, [])
  const { startQuiz } = useQuizStore()
  const navigate = useNavigate()

  const quizPath = variant === 'b' ? '/quiz/b' : variant === 'a' ? '/quiz/a' : '/quiz'

  const handleStart = async () => {
    if (loading) return
    setLoading(true)
    try {
      const { session_token } = await quizService.startQuiz()
      startQuiz(session_token)
    } catch {
      startQuiz(`local_${Date.now()}`)
    }
    navigate(quizPath)
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
        <circle cx="72"   cy="90"  r="2"   fill="#D4A855" opacity="0.5" />
        <circle cx="173"  cy="225" r="1.5" fill="#C8963E" opacity="0.55" />
        <circle cx="288"  cy="72"  r="2.5" fill="#D4A855" opacity="0.3" />
        <circle cx="115"  cy="405" r="1.5" fill="#D4A855" opacity="0.45" />
        <circle cx="216"  cy="585" r="2"   fill="#C8963E" opacity="0.4" />
        <circle cx="1267" cy="108" r="2"   fill="#D4A855" opacity="0.45" />
        <circle cx="1368" cy="270" r="1.5" fill="#C8963E" opacity="0.5" />
        <circle cx="1325" cy="495" r="2"   fill="#C8963E" opacity="0.4" />
        <circle cx="1123" cy="675" r="1.5" fill="#D4A855" opacity="0.5" />
        <circle cx="504"  cy="45"  r="1.5" fill="#C8963E" opacity="0.5" />
        <circle cx="720"  cy="27"  r="2"   fill="#D4A855" opacity="0.4" />
        <circle cx="648"  cy="828" r="2"   fill="#D4A855" opacity="0.4" />
        <circle cx="864"  cy="855" r="1.5" fill="#C8963E" opacity="0.5" />
      </svg>

      {/* Main content */}
      <div className="max-w-sm mx-auto text-center relative z-10 py-12">

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-gold-600 mb-6 leading-tight">
          Descubra o Bloqueio Invisível que Trava sua Prosperidade
        </h1>

        {/* Micro VSL — Vturb player */}
        <div className="mb-8">
          <vturb-smartplayer
            id="vid-69cc705f9a29533f270b1d5f"
            style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}
          ></vturb-smartplayer>
        </div>

        {/* Authority mini card */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-gold-400 overflow-hidden">
              <img src="/FotoRenata.jpg" alt="Mestra Renata Alves" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Mestra Renata Alves</p>
            <span className="text-xs text-gray-500">Numeróloga e Terapeuta Vibracional</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Descobrir meu bloqueio →'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          +3.847 mulheres já fizeram o diagnóstico
        </p>
      </div>
    </div>
  )
}

export default Prelanding
