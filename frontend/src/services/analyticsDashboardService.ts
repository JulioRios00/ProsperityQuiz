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

export interface ActiveDateRange {
  start_date: string | null
  end_date: string | null
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

export interface AnswerOptionStat {
  value: string
  count: number
  percentage: number
}

export interface AnswerQuestionAnalytics {
  screen_id: string
  total_answers: number
  most_selected: AnswerOptionStat | null
  least_selected: AnswerOptionStat | null
  top_answers: AnswerOptionStat[]
}

export interface VariantAnswerAnalytics {
  quiz_variant: 'a' | 'b' | 'default'
  questions: AnswerQuestionAnalytics[]
}

export interface AnswerAnalyticsData {
  active_variant_filter: 'all' | 'a' | 'b' | 'default'
  active_date_range?: ActiveDateRange
  variants: VariantAnswerAnalytics[]
}

export interface ReconciliationCounts {
  checkout_clicks: number
  sales_confirmed: number
  matched: number
  checkout_without_sale: number
  sale_without_checkout: number
  reconciliation_rate: number
}

export interface AnalyticsReconciliationData {
  active_variant_filter: 'all' | 'a' | 'b' | 'default'
  active_date_range?: ActiveDateRange
  counts: ReconciliationCounts
  samples: {
    checkout_without_sale: string[]
    sale_without_checkout: string[]
  }
}

export interface AnalyticsDashboardData {
  summary: SummaryMetrics
  performance: PerformanceMetrics
  traffic: TrafficMetrics
  campaigns: CampaignSummary
  devices_summary: DevicesSummary
  active_date_range?: ActiveDateRange
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
  startDate?: string,
  endDate?: string,
): Promise<AnalyticsDashboardData> {
  const params: {
    limit: number
    recent: number
    variant: 'all' | 'a' | 'b' | 'default'
    start_date?: string
    end_date?: string
  } = {
    limit,
    recent,
    variant,
  }

  if (startDate) {
    params.start_date = startDate
  }
  if (endDate) {
    params.end_date = endDate
  }

  const response = await api.get<AnalyticsDashboardData>('/analytics/funnel', {
    params,
  })

  return response.data
}

export async function getAnswerAnalytics(
  limit = 10000,
  variant: 'all' | 'a' | 'b' | 'default' = 'all',
  startDate?: string,
  endDate?: string,
): Promise<AnswerAnalyticsData> {
  const params: {
    limit: number
    variant: 'all' | 'a' | 'b' | 'default'
    start_date?: string
    end_date?: string
  } = {
    limit,
    variant,
  }

  if (startDate) {
    params.start_date = startDate
  }
  if (endDate) {
    params.end_date = endDate
  }

  const response = await api.get<AnswerAnalyticsData>('/analytics/answers', {
    params,
  })

  return response.data
}

export async function getAnalyticsReconciliation(
  variant: 'all' | 'a' | 'b' | 'default' = 'all',
  startDate?: string,
  endDate?: string,
): Promise<AnalyticsReconciliationData> {
  const params: {
    variant: 'all' | 'a' | 'b' | 'default'
    start_date?: string
    end_date?: string
  } = {
    variant,
  }

  if (startDate) {
    params.start_date = startDate
  }
  if (endDate) {
    params.end_date = endDate
  }

  const response = await api.get<AnalyticsReconciliationData>(
    '/analytics/reconciliation',
    {
      params,
    },
  )

  return response.data
}
