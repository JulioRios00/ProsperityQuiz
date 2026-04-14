import api from './api'

export interface SummaryMetrics {
  events_analyzed: number
  sessions: number
  emails_submitted: number
  answers: number
  screen_loaded: number
  screen_time: number
}

export interface CountByType {
  event_type: string
  count: number
}

export interface CountByDevice {
  device: string
  count: number
}

export interface CountByBrowser {
  browser: string
  count: number
}

export interface CountByUtmSource {
  utm_source: string
  count: number
}

export interface CountByVariant {
  quiz_variant: string
  count: number
}

export interface ScreenMetric {
  screen_id: string
  loads: number
  avg_time_on_screen: number
}

export interface TopAnswer {
  screen_id: string
  value: string
  count: number
}

export interface RecentEvent {
  id: string
  created_at: string | null
  session_id: string | null
  event_type: string
  screen_id: string | number | null
  quiz_variant: string
  event_value: unknown
  time_on_screen: number | null
  device: string | null
  browser: string | null
  utm_source: string | null
}

export interface AnalyticsDashboardData {
  summary: SummaryMetrics
  active_variant_filter?: string
  events_by_type: CountByType[]
  variants: CountByVariant[]
  devices: CountByDevice[]
  browsers: CountByBrowser[]
  utm_sources: CountByUtmSource[]
  screens: ScreenMetric[]
  top_answers: TopAnswer[]
  recent_events: RecentEvent[]
}

export async function getAnalyticsDashboard(
  limit = 5000,
  recent = 30,
  variant: 'all' | 'a' | 'b' | 'default' = 'all',
): Promise<AnalyticsDashboardData> {
  const response = await api.get<AnalyticsDashboardData>('/analytics/funnel', {
    params: { limit, recent, variant },
  })

  return response.data
}
