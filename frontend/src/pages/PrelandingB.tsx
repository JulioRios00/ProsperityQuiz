import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../store/quizStore'
import { useFacebookPixels } from '../hooks/useFacebookPixels'
import { track, captureAndStoreUtms } from '../services/analyticsService'

const PIXELS_B_FALLBACK = ['908649312046405', '1421941556280579']
const PIXELS_B = (import.meta.env.VITE_FB_PIXEL_ID_B ?? import.meta.env.VITE_FB_PIXEL_ID ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

const PIXELS_B_TO_USE = PIXELS_B.length ? PIXELS_B : PIXELS_B_FALLBACK

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function PrelandingB() {
  const [loading, setLoading] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const scriptLoadedRef = useRef(false)

  useFacebookPixels(PIXELS_B_TO_USE)
  const { startQuiz } = useQuizStore()
  const navigate = useNavigate()

  useEffect(() => {
    captureAndStoreUtms()
    track({ event_type: 'page_loaded', screen_id: 'prelanding', event_value: 'b' })

    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const s = document.createElement('script')
      s.src = 'https://scripts.converteai.net/859d3a9a-adcf-4da6-86a3-43be35f0e474/players/69cc705f9a29533f270b1d5f/v4/player.js'
      s.async = true
      s.onerror = () => setVideoError(true)
      document.head.appendChild(s)

      // Fallback: if player doesn't render within 8s, show image fallback
      const timer = setTimeout(() => {
        const el = document.getElementById('vid-69cc705f9a29533f270b1d5f')
        if (!el || el.childElementCount === 0) setVideoError(true)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleStart = async () => {
    if (loading) return
    setLoading(true)
    track({ event_type: 'cta_click', screen_id: 'prelanding', event_value: 'b' })
    try {
      const { session_token } = await quizService.startQuiz()
      startQuiz(session_token)
    } catch {
      startQuiz(`local_${Date.now()}`)
    }
    navigate('/quiz/b')
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
          <radialGradient id="centerGlowB" cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#D4A855" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#D4A855" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="900" fill="url(#centerGlowB)" />
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
        <h1 className="text-3xl md:text-4xl font-bold text-gold-600 mb-6 leading-tight">
          O Dinheiro Foge de Você? Descubra o Bloqueio que 87% das Mulheres NÃO Sabem que Carregam
        </h1>

        {/* Video — Vturb player with image fallback */}
        <div className="mb-8">
          {videoError ? (
            /* Fallback: expert image + play button overlay */
            <div
              className="relative mx-auto cursor-pointer"
              style={{ maxWidth: '400px' }}
              onClick={handleStart}
            >
              <img
                src="/FotoRenata.jpg"
                alt="Mestra Renata Alves"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{ background: 'rgba(0,0,0,0.35)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,168,85,0.9)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <vturb-smartplayer
              id="vid-69cc705f9a29533f270b1d5f"
              style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}
            ></vturb-smartplayer>
          )}
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
            {loading ? 'Iniciando...' : 'Quero Descobrir Meu Bloqueio Grátis →'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          +3.847 mulheres já fizeram o diagnóstico
        </p>
      </div>
    </div>
  )
}

export default PrelandingB
