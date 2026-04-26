import {
  captureAndStoreAttribution,
  getAttributionPayload,
  getCurrentQuizVariant,
  getOrCreateJourneyId,
} from './attributionService';

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
  journey_id?: string;
  src?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  timestamp?: string;
}

function getDevice(): string {
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean; platform?: string } }).userAgentData;
  if (uaData?.mobile === true) return 'mobile';

  const ua = navigator.userAgent;
  const isIpadOsDesktopUA = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  if (/iPad|Tablet|Nexus 7|Nexus 10|KFAPWI|Silk/i.test(ua) || isIpadOsDesktopUA) return 'tablet';
  if (/Mobile|Mobi|Android.+Mobile|iPhone|iPod|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';

  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;

  if (/FBAN|FBAV|Instagram/i.test(ua)) return 'in_app';
  if (/EdgA|EdgiOS|Edg\//i.test(ua)) return 'edge';
  if (/OPR|Opera/i.test(ua)) return 'opera';
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/CriOS|Chrome/i.test(ua)) return 'chrome';
  if (/FxiOS|Firefox/i.test(ua)) return 'firefox';
  if (/Safari/i.test(ua) && !/CriOS|Chrome|Chromium|Edg|OPR|SamsungBrowser/i.test(ua)) return 'safari';
  return 'other';
}

export function captureAndStoreUtms(): void {
  captureAndStoreAttribution();
}

function buildEvent(partial: AnalyticsEvent): AnalyticsEvent {
  const attribution = getAttributionPayload();
  const journeyId = getOrCreateJourneyId();
  const quizVariant = getCurrentQuizVariant();

  return {
    device: getDevice(),
    browser: getBrowser(),
    quiz_variant: quizVariant,
    journey_id: journeyId,
    timestamp: new Date().toISOString(),
    ...attribution,
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
