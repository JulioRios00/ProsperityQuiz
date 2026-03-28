import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../store/quizStore'

interface PrelandingProps {
  variant?: 'a' | 'b'
}

function Prelanding({ variant }: PrelandingProps) {
  const [loading, setLoading] = useState(false)
  const { startQuiz } = useQuizStore()
  const navigate = useNavigate()

  const quizPath = variant === 'b' ? '/quiz/b' : variant === 'a' ? '/quiz/a' : '/quiz'

  const handleStart = async () => {
    setLoading(true)
    try {
      const { session_token } = await quizService.startQuiz()
      startQuiz(session_token)
      navigate(quizPath)
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

        {/* Micro VSL — 9:16 vertical, max-width 400px, autoplay muted */}
        <div
          className="relative mx-auto rounded-2xl overflow-hidden mb-8 shadow-xl"
          style={{ aspectRatio: '9/16', maxWidth: 360, background: '#0a0a14' }}
        >
          {/* TODO: replace with actual video embed
              <iframe
                src="VIDEO_URL?autoplay=1&mute=1&loop=1"
                allow="autoplay; fullscreen"
                className="absolute inset-0 w-full h-full"
              />
          */}
          <img
            src="/FotoRenata.png"
            alt="Mestra Renata Alves"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(212,168,85,0.9)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Authority mini card */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-gold-400 overflow-hidden">
              <img src="/FotoRenata.png" alt="Mestra Renata Alves" className="w-full h-full object-cover" />
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
