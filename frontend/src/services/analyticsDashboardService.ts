import api from './api'

export interface SummaryMetrics {
  events_analyzed: number
  sessions: number
  completion_rate: number
  visits: number
  answers_started: number
  average_steps: number
  total_steps: number
  leads_emails: number
  total_conclusions: number
}

export interface PerformanceMetrics {
  visitors: number
  responses: number
  leads: number
  conclusions: number
  completion_rate: number
  total_conclusions: number
}

export interface TrafficTimelineItem {
  hour: string
  visitors: number
  responses: number
  leads: number
}

export interface TrafficMetrics {
  interaction_rate: number
  bounce_rate: number
  timeline: TrafficTimelineItem[]
}

export interface CampaignSummary {
  total_tracked: number
  best_source: string | null
  sources: CountByUtmSource[]
}

export interface DevicesSummary {
  most_used: string | null
  total: number
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
  screen_index: number
  label: string
  visitors: number
  retention_rate: number
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
  performance: PerformanceMetrics
  traffic: TrafficMetrics
  campaigns: CampaignSummary
  devices_summary: DevicesSummary
  active_variant_filter?: string
  events_by_type: CountByType[]
  variants: CountByVariant[]
  devices: CountByDevice[]
  browsers: CountByBrowser[]
  utm_sources: CountByUtmSource[]
  screen_retention: ScreenMetric[]
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
