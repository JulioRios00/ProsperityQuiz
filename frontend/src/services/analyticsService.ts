const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';
const ENDPOINT_SINGLE = `${API_BASE}/analytics/event`;
const ENDPOINT_BATCH = `${API_BASE}/analytics/events`;

export interface AnalyticsEvent {
  session_id?: string;
  event_type: string;
  screen_id?: string | number;
  quiz_variant?: 'a' | 'b' | 'default';
  event_value?: unknown;
  time_on_screen?: number;
  device?: string;
  browser?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  timestamp?: string;
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) return 'edge';
  if (/Chrome/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari';
  if (/Firefox/i.test(ua)) return 'firefox';
  return 'other';
}

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

// Persist UTMs captured on entry so they survive navigation
function getStoredUtms(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem('utms');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function captureAndStoreUtms(): void {
  const utms = getUtmParams();
  if (Object.keys(utms).length > 0) {
    sessionStorage.setItem('utms', JSON.stringify(utms));
  }
}

function getQuizVariant(): 'a' | 'b' | 'default' {
  const pathname = window.location.pathname.toLowerCase()

  if (pathname === '/a' || pathname.startsWith('/quiz/a')) {
    sessionStorage.setItem('quiz_variant', 'a')
    return 'a'
  }

  if (pathname === '/b' || pathname.startsWith('/quiz/b')) {
    sessionStorage.setItem('quiz_variant', 'b')
    return 'b'
  }

  const stored = sessionStorage.getItem('quiz_variant')
  if (stored === 'a' || stored === 'b') {
    return stored
  }

  return 'default'
}

function buildEvent(partial: AnalyticsEvent): AnalyticsEvent {
  const utms = Object.keys(getUtmParams()).length > 0 ? getUtmParams() : getStoredUtms();
  return {
    device: getDevice(),
    browser: getBrowser(),
    quiz_variant: getQuizVariant(),
    timestamp: new Date().toISOString(),
    ...utms,
    ...partial,
  };
}

export async function track(partial: AnalyticsEvent): Promise<void> {
  const event = buildEvent(partial);
  try {
    await fetch(ENDPOINT_SINGLE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // silently ignore — analytics must never break the app
  }
}

export function trackBeacon(partial: AnalyticsEvent): void {
  const event = buildEvent(partial);
  try {
    navigator.sendBeacon(ENDPOINT_SINGLE, JSON.stringify(event));
  } catch {
    // silently ignore
  }
}

export async function trackBatch(partials: AnalyticsEvent[]): Promise<void> {
  const events = partials.map(buildEvent);
  try {
    await fetch(ENDPOINT_BATCH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    });
  } catch {
    // silently ignore
  }
}
