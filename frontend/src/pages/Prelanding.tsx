import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../store/quizStore'
import { useFacebookPixels } from '../hooks/useFacebookPixels'
import { track, captureAndStoreUtms } from '../services/analyticsService'

const PIXELS_A_FALLBACK = ['1899887307317878', '25534330632909821']
const PIXELS_A = (import.meta.env.VITE_FB_PIXEL_ID_A ?? import.meta.env.VITE_FB_PIXEL_ID ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

const PIXELS_A_TO_USE = PIXELS_A.length ? PIXELS_A : PIXELS_A_FALLBACK

interface PrelandingProps {
  variant?: 'a' | 'b'
}

function Prelanding({ variant }: PrelandingProps) {
  const [loading, setLoading] = useState(false)

  // Fire Meta Pixels only for the A variant (not the default / route)
  useFacebookPixels(variant === 'a' ? PIXELS_A_TO_USE : [])

  useEffect(() => {
    captureAndStoreUtms()
    track({ event_type: 'page_loaded', screen_id: 'prelanding', event_value: variant ?? 'default' })
  }, [])
  const { startQuiz } = useQuizStore()
  const navigate = useNavigate()
  const location = useLocation()

  const quizPath = variant === 'b' ? '/quiz/b' : variant === 'a' ? '/quiz/a' : '/quiz'

  const handleStart = async () => {
    if (loading) return
    setLoading(true)
    track({ event_type: 'cta_click', screen_id: 'prelanding', event_value: variant ?? 'default' })
    try {
      const { session_token } = await quizService.startQuiz()
      startQuiz(session_token)
    } catch {
      startQuiz(`local_${Date.now()}`)
    }
    navigate(`${quizPath}${location.search}`)
  }

  return (
    <div className="min-h-screen bg-[#FBF7F1] px-4 py-10">
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 text-xs font-semibold text-gold-700 shadow-sm">
          ✨ Diagnóstico Tridimensional
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-gray-900 leading-snug">
          Faça o diagnóstico da{' '}
          <span className="text-gold-600">Mestra Renata Alves</span>{' '}
          e descubra o bloqueio que trava sua prosperidade
        </h1>

        <div className="mt-6 rounded-2xl border border-gold-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gold-300 overflow-hidden">
              <img src="/FotoRenata.jpg" alt="Mestra Renata Alves" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Mestra Renata Alves</p>
              <p className="text-xs text-gray-500">Numeróloga e Terapeuta Vibracional</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-600 leading-relaxed">
          No final você recebe um diagnóstico personalizado que cruza numerologia,
          astrologia e ciclos lunares, revelando{' '}
          <strong className="text-gray-900">o nome do seu bloqueio</strong> e os{' '}
          <strong className="text-gray-900">dias exatos do mês</strong> em que ele
          enfraquece — em apenas <strong className="text-gray-900">2 minutos</strong>.
        </p>

        <div className="mt-6 rounded-2xl bg-[#1B1031] p-4 shadow-lg">
          <svg viewBox="0 0 320 220" className="w-full h-auto" fill="none">
            <defs>
              <linearGradient id="triangleStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F5D48A" />
                <stop offset="1" stopColor="#C8963E" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="320" height="220" rx="16" fill="#1B1031" />
            <circle cx="160" cy="110" r="90" stroke="#2D1A4D" strokeWidth="1" />
            <circle cx="160" cy="110" r="60" stroke="#2D1A4D" strokeWidth="1" />
            <polygon
              points="160,36 262,180 58,180"
              stroke="url(#triangleStroke)"
              strokeWidth="4"
              fill="transparent"
              strokeLinejoin="round"
            />
            <circle cx="160" cy="36" r="10" fill="#F5D48A" />
            <circle cx="262" cy="180" r="10" fill="#F5D48A" />
            <circle cx="58" cy="180" r="10" fill="#F5D48A" />
            <text x="160" y="28" textAnchor="middle" fill="#F5D48A" fontSize="10" fontWeight="700">NUMEROLOGIA</text>
            <text x="262" y="206" textAnchor="middle" fill="#F5D48A" fontSize="10" fontWeight="700">CICLO LUNAR</text>
            <text x="58" y="206" textAnchor="middle" fill="#F5D48A" fontSize="10" fontWeight="700">ASTROLOGIA</text>
          </svg>
        </div>

        <div className="mt-8">
          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Descobrir meu bloqueio →'}
          </button>
          <p className="text-xs text-gray-400 mt-3">
            +3.847 mulheres já fizeram o diagnóstico
          </p>
        </div>
      </div>
    </div>
  )
}

export default Prelanding
