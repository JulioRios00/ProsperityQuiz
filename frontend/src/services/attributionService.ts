const ATTRIBUTION_STORAGE_KEY = 'attribution_payload_v1'
const JOURNEY_STORAGE_KEY = 'journey_id'
const QUIZ_VARIANT_KEY = 'quiz_variant'
const ATTRIBUTION_COOKIE_KEY = 'attribution_payload_v1'
const JOURNEY_COOKIE_KEY = 'journey_id'

const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'src',
] as const

export type QuizVariant = 'a' | 'b' | 'default'

function readJson(value: string | null): Record<string, string> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, string>
    }
  } catch {
    // ignore invalid persisted payload
  }
  return {}
}

function setCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const encodedName = `${name}=`
  const parts = document.cookie.split(';').map((part) => part.trim())
  for (const part of parts) {
    if (part.startsWith(encodedName)) {
      return decodeURIComponent(part.slice(encodedName.length))
    }
  }
  return null
}

function getStorageValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(key) ?? localStorage.getItem(key)
}

function persistStorageValue(key: string, value: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(key, value)
  localStorage.setItem(key, value)
}

function getTrackingParamsFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const payload: Record<string, string> = {}

  for (const key of TRACKING_KEYS) {
    const value = params.get(key)
    if (value) payload[key] = value
  }

  return payload
}

function normalizeVariant(value: string | null): QuizVariant {
  if (value === 'a' || value === 'b') return value
  return 'default'
}

function inferVariantFromPath(pathname: string): QuizVariant {
  const path = pathname.toLowerCase()
  if (/^\/a\/?$/.test(path) || /^\/quiz\/a(?:\/|$)/.test(path)) {
    return 'a'
  }
  if (/^\/b\/?$/.test(path) || /^\/quiz\/b(?:\/|$)/.test(path)) {
    return 'b'
  }
  return 'default'
}

function persistVariant(variant: QuizVariant): void {
  if (variant === 'default') return
  persistStorageValue(QUIZ_VARIANT_KEY, variant)
}

function getStoredVariant(): QuizVariant {
  const stored = getStorageValue(QUIZ_VARIANT_KEY)
  return normalizeVariant(stored)
}

export function getCurrentQuizVariant(): QuizVariant {
  if (typeof window === 'undefined') return 'default'

  const fromPath = inferVariantFromPath(window.location.pathname)
  if (fromPath !== 'default') {
    persistVariant(fromPath)
    return fromPath
  }

  const stored = getStoredVariant()
  if (stored !== 'default') {
    return stored
  }

  return 'default'
}

function generateJourneyId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `journey_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateJourneyId(): string {
  if (typeof window === 'undefined') {
    return generateJourneyId()
  }

  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('journey_id')
  if (fromUrl) {
    persistStorageValue(JOURNEY_STORAGE_KEY, fromUrl)
    setCookie(JOURNEY_COOKIE_KEY, fromUrl)
    return fromUrl
  }

  const stored = getStorageValue(JOURNEY_STORAGE_KEY) ?? getCookie(JOURNEY_COOKIE_KEY)
  if (stored) {
    persistStorageValue(JOURNEY_STORAGE_KEY, stored)
    setCookie(JOURNEY_COOKIE_KEY, stored)
    return stored
  }

  const created = generateJourneyId()
  persistStorageValue(JOURNEY_STORAGE_KEY, created)
  setCookie(JOURNEY_COOKIE_KEY, created)
  return created
}

function getStoredAttribution(): Record<string, string> {
  const fromStorage = readJson(getStorageValue(ATTRIBUTION_STORAGE_KEY))
  const fromCookie = readJson(getCookie(ATTRIBUTION_COOKIE_KEY))
  return { ...fromCookie, ...fromStorage }
}

function persistAttribution(payload: Record<string, string>): void {
  const json = JSON.stringify(payload)
  persistStorageValue(ATTRIBUTION_STORAGE_KEY, json)
  setCookie(ATTRIBUTION_COOKIE_KEY, json)
}

export function captureAndStoreAttribution(): Record<string, string> {
  const existing = getStoredAttribution()
  const fromUrl = getTrackingParamsFromUrl()
  const journeyId = getOrCreateJourneyId()
  const variant = getCurrentQuizVariant()

  const merged: Record<string, string> = {
    ...existing,
    ...fromUrl,
    journey_id: journeyId,
  }

  if (variant !== 'default') {
    merged.quiz_variant = variant
  }

  persistAttribution(merged)
  return merged
}

export function getAttributionPayload(): Record<string, string> {
  const existing = getStoredAttribution()
  const fromUrl = getTrackingParamsFromUrl()

  if (Object.keys(fromUrl).length > 0) {
    const merged = { ...existing, ...fromUrl }
    persistAttribution(merged)
    return merged
  }

  return existing
}

export function buildCheckoutUrlWithAttribution(
  baseUrl: string,
  params?: {
    sessionId?: string | null
  },
): string {
  if (typeof window === 'undefined') {
    return baseUrl
  }

  const checkoutUrl = new URL(baseUrl)
  const payload = captureAndStoreAttribution()
  const journeyId = getOrCreateJourneyId()
  const variant = getCurrentQuizVariant()

  for (const key of TRACKING_KEYS) {
    const value = payload[key]
    if (value) {
      checkoutUrl.searchParams.set(key, value)
    }
  }

  if (journeyId) {
    checkoutUrl.searchParams.set('journey_id', journeyId)
  }

  if (variant !== 'default') {
    checkoutUrl.searchParams.set('quiz_variant', variant)
  }

  if (params?.sessionId) {
    checkoutUrl.searchParams.set('session_id', params.sessionId)
  }

  return checkoutUrl.toString()
}
