import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  type AnalyticsDashboardData,
  getAnalyticsDashboard,
} from '../services/analyticsDashboardService'

function numberFormat(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function percentFormat(value: number): string {
  return `${value.toFixed(1)}%`
}

function averageStepsFormat(average: number, total: number): string {
  const normalized = Number.isInteger(average) ? String(average) : average.toFixed(1)
  return `${normalized}/${total}`
}

function formatEventValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [accessKey, setAccessKey] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [variantFilter, setVariantFilter] = useState<'all' | 'a' | 'b' | 'default'>('all')

  const requiredKey = import.meta.env.VITE_ANALYTICS_DASHBOARD_KEY
  const requiredUser = import.meta.env.VITE_ANALYTICS_DASHBOARD_USER
  const requiredPassword = import.meta.env.VITE_ANALYTICS_DASHBOARD_PASSWORD
  const hasLoginCredentials = Boolean(requiredUser && requiredPassword)
  const authStorageKey = 'analytics_dashboard_access_v2'

  useEffect(() => {
    const stored = localStorage.getItem(authStorageKey)
    console.info('[AnalyticsDashboard] Auth gate config', {
      envMode: import.meta.env.MODE,
      hasLoginCredentials,
      hasRequiredKey: Boolean(requiredKey),
      hasRequiredUser: Boolean(requiredUser),
      hasRequiredPassword: Boolean(requiredPassword),
      storageAccess: stored,
    })

    if (!requiredKey && !hasLoginCredentials) {
      console.info('[AnalyticsDashboard] Unlocking automatically (no key/login configured)')
      setIsUnlocked(true)
      return
    }

    if (stored === 'ok') {
      console.info('[AnalyticsDashboard] Unlocking from localStorage cache')
      setIsUnlocked(true)
    }
  }, [requiredKey, requiredUser, requiredPassword, hasLoginCredentials])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsDashboard(10000, 50, variantFilter)
      setData(response)
    } catch {
      setError('Não foi possível carregar os dados de analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isUnlocked) return
    loadDashboard()
  }, [isUnlocked, variantFilter])

  const handleUnlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isLoginValid =
      hasLoginCredentials
      && loginEmail.trim().toLowerCase() === String(requiredUser).trim().toLowerCase()
      && loginPassword === requiredPassword

    const isKeyValid = requiredKey && accessKey === requiredKey

    console.info('[AnalyticsDashboard] Unlock attempt', {
      hasLoginCredentials,
      emailMatch: loginEmail.trim().toLowerCase() === String(requiredUser).trim().toLowerCase(),
      passwordProvided: Boolean(loginPassword),
      keyProvided: Boolean(accessKey),
      isLoginValid,
      isKeyValid: Boolean(isKeyValid),
    })

    if ((!hasLoginCredentials && !requiredKey) || isLoginValid || isKeyValid) {
      localStorage.setItem(authStorageKey, 'ok')
      console.info('[AnalyticsDashboard] Access granted')
      setIsUnlocked(true)
      setError(null)
      return
    }

    setError(
      hasLoginCredentials
        ? 'Credenciais inválidas para acessar o dashboard.'
        : 'Chave inválida para acessar o dashboard.',
    )
  }

  const exportRecentEventsCsv = () => {
    if (!data?.recent_events?.length) return

    const headers = [
      'id',
      'created_at',
      'session_id',
      'event_type',
      'quiz_variant',
      'screen_id',
      'event_value',
      'time_on_screen',
      'device',
      'browser',
      'utm_source',
    ]

    const escapeCell = (value: unknown) => {
      const raw = value === null || value === undefined ? '' : String(value)
      return `"${raw.split('"').join('""')}"`
    }

    const rows = data.recent_events.map((event) => [
      event.id,
      event.created_at ?? '',
      event.session_id ?? '',
      event.event_type,
      event.quiz_variant ?? '',
      event.screen_id ?? '',
      formatEventValue(event.event_value),
      event.time_on_screen ?? '',
      event.device ?? '',
      event.browser ?? '',
      event.utm_source ?? '',
    ])

    const csv = [
      headers.map(escapeCell).join(','),
      ...rows.map((row) => row.map(escapeCell).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_recent_events_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isUnlocked) {
    return (
      <div className="relative min-h-screen bg-cream-50">
        <div className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-y-0 right-0 z-10 w-full max-w-md border-l border-gold-400/20 bg-white p-6 shadow-2xl">
          <h1 className="text-2xl font-bold text-gold-600">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            {hasLoginCredentials
              ? 'Faça login para acessar o dashboard.'
              : 'Este painel está protegido por chave de acesso.'}
          </p>

          <form className="mt-6 space-y-3" onSubmit={handleUnlock}>
            {hasLoginCredentials ? (
              <>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-gold-500 focus:ring-2"
                  autoComplete="username"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-gold-500 focus:ring-2"
                  autoComplete="current-password"
                />
              </>
            ) : (
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Digite a chave"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-gold-500 focus:ring-2"
              />
            )}

            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>

          {error && (
            <p className="mt-3 rounded-lg border border-red-300 bg-red-50 p-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <p className="mt-4 text-xs text-gray-500">
            Acesso liberado neste navegador após login.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-xl border border-gold-400/30 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gold-600">Analytics Dashboard</h1>
            <p className="text-sm text-gray-600">
              Funil de conversão, tráfego e retenção por tela
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value as 'all' | 'a' | 'b' | 'default')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-gold-500 focus:ring-2"
            >
              <option value="all">Todas variantes</option>
              <option value="a">Somente Quiz A</option>
              <option value="b">Somente Quiz B</option>
              <option value="default">Somente Default</option>
            </select>
            <button
              onClick={exportRecentEventsCsv}
              className="btn-secondary"
              disabled={!data?.recent_events?.length}
            >
              Exportar CSV
            </button>
            <button
              onClick={loadDashboard}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Taxa de conclusão"
            value={data ? percentFormat(data.summary.completion_rate) : '0.0%'}
            tone="amber"
          />
          <KpiCard
            label="Visitas"
            value={data ? numberFormat(data.summary.visits) : '0'}
            tone="neutral"
          />
          <KpiCard
            label="Respostas iniciadas"
            value={data ? numberFormat(data.summary.answers_started) : '0'}
            tone="neutral"
          />
          <KpiCard
            label="Média Etapas"
            value={
              data
                ? averageStepsFormat(
                  data.summary.average_steps,
                  data.summary.total_steps,
                )
                : '0/44'
            }
            tone="neutral"
          />
          <KpiCard
            label="Leads (email)"
            value={data ? numberFormat(data.summary.leads_emails) : '0'}
            tone="green"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Desempenho">
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <MetricCell
                label="Taxa de conclusão"
                value={
                  data
                    ? percentFormat(data.performance.completion_rate)
                    : '0.0%'
                }
              />
              <MetricCell
                label="Total de conclusões"
                value={
                  data ? numberFormat(data.performance.total_conclusions) : '0'
                }
              />
            </div>

            <FunnelBars
              visitors={data?.performance.visitors ?? 0}
              responses={data?.performance.responses ?? 0}
              leads={data?.performance.leads ?? 0}
              conclusions={data?.performance.conclusions ?? 0}
            />
          </Panel>

          <Panel title="Tráfego">
            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <MetricCell
                label="Taxa de interação"
                value={
                  data ? percentFormat(data.traffic.interaction_rate) : '0.0%'
                }
                accent="text-emerald-400"
              />
              <MetricCell
                label="Taxa de rejeição"
                value={data ? percentFormat(data.traffic.bounce_rate) : '0.0%'}
                accent="text-red-400"
              />
            </div>
            <TrafficChart data={data?.traffic.timeline ?? []} />
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Campanhas">
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <MetricCell
                label="Total rastreado"
                value={data ? numberFormat(data.campaigns.total_tracked) : '0'}
              />
              <MetricCell
                label="Melhor origem"
                value={data?.campaigns.best_source || '—'}
              />
            </div>
            <SimpleList
              items={data?.campaigns.sources.map((item) => ({
                label: item.utm_source,
                value: item.count,
              })) ?? []}
              emptyLabel="Nenhuma campanha rastreada"
            />
          </Panel>

          <Panel title="Dispositivos">
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <MetricCell
                label="Mais usado"
                value={data?.devices_summary.most_used || '—'}
              />
              <MetricCell
                label="Total"
                value={data ? numberFormat(data.devices_summary.total) : '0'}
              />
            </div>
            <SimpleList
              items={data?.devices.map((item) => ({
                label: item.device,
                value: item.count,
              })) ?? []}
            />
          </Panel>
        </section>

        <Panel title="Retenção por Tela">
          <RetentionChart data={data?.screen_retention ?? []} />
        </Panel>

      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gold-400/20 bg-white p-4 shadow-sm md:p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  )
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'amber' | 'green' | 'neutral'
}) {
  const valueColor = {
    amber: 'text-gold-600',
    green: 'text-emerald-600',
    neutral: 'text-gray-900',
  }[tone]

  return (
    <div className="rounded-xl border border-gold-400/20 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-2 text-4xl font-bold leading-none ${valueColor}`}>{value}</p>
    </div>
  )
}

function EmptyState() {
  return <p className="text-sm text-gray-500">Sem dados.</p>
}

function SimpleList({
  items,
  emptyLabel = 'Sem dados.',
}: {
  items: Array<{ label: string; value: number }>
  emptyLabel?: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">{emptyLabel}</p>
  }

  return (
    <div className="space-y-2 text-sm">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
        >
          <span className="text-gray-700">{item.label}</span>
          <span className="font-medium text-gray-900">{numberFormat(item.value)}</span>
        </div>
      ))}
    </div>
  )
}

function MetricCell({
  label,
  value,
  accent = 'text-gray-900',
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}

function FunnelBars({
  visitors,
  responses,
  leads,
  conclusions,
}: {
  visitors: number
  responses: number
  leads: number
  conclusions: number
}) {
  const base = Math.max(visitors, 1)
  const rows = [
    { label: 'Visitantes', value: visitors, color: '#3b82f6' },
    { label: 'Respostas', value: responses, color: '#ec4899' },
    { label: 'Leads', value: leads, color: '#a855f7' },
    { label: 'Conclusões', value: conclusions, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-3">
      {rows.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.value / base) * 100))
        return (
          <div key={item.label} className="grid grid-cols-[110px_1fr_70px_55px] items-center gap-3 text-sm">
            <span className="text-gray-700">{item.label}</span>
            <div className="h-2 rounded bg-gray-100">
              <div
                className="h-2 rounded"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-right text-gray-500">{percentFormat(pct)}</span>
            <span className="text-right text-gray-900">{numberFormat(item.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

function TrafficChart({
  data,
}: {
  data: Array<{ hour: string; visitors: number; responses: number; leads: number }>
}) {
  if (data.length === 0) return <EmptyState />

  const width = 960
  const height = 220
  const padding = { top: 12, right: 8, bottom: 12, left: 8 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const max = Math.max(
    1,
    ...data.flatMap((item) => [item.visitors, item.responses, item.leads]),
  )

  const linePoints = (
    key: 'visitors' | 'responses' | 'leads',
  ): string => {
    return data
      .map((item, index) => {
        const x = padding.left + (index / (data.length - 1 || 1)) * chartW
        const y = padding.top + chartH - (item[key] / max) * chartH
        return `${x},${y}`
      })
      .join(' ')
  }

  const tickIndexes = [0, 3, 6, 9, 12, 15, 18, 21]
  const gridLevels = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="space-y-3">
      <div className="h-[220px] w-full rounded-lg border border-gray-100 bg-cream-50/60 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {gridLevels.map((level) => {
            const y = padding.top + chartH - level * chartH
            return (
              <line
                key={level}
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
            )
          })}

          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints('visitors')}
          />
          <polyline
            fill="none"
            stroke="#ec4899"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints('responses')}
          />
          <polyline
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints('leads')}
          />

          {tickIndexes.map((index) => {
            const item = data[index]
            if (!item) return null
            const x = padding.left + (index / (data.length - 1 || 1)) * chartW
            const yVisitors = padding.top + chartH - (item.visitors / max) * chartH
            const yResponses = padding.top + chartH - (item.responses / max) * chartH
            const yLeads = padding.top + chartH - (item.leads / max) * chartH
            return (
              <g key={index}>
                <circle cx={x} cy={yVisitors} r="3" fill="#3b82f6" />
                <circle cx={x} cy={yResponses} r="3" fill="#ec4899" />
                <circle cx={x} cy={yLeads} r="3" fill="#a855f7" />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        {tickIndexes.map((index) => (
          <span key={index}>{data[index]?.hour || '--:--'}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <LegendDot color="#3b82f6" label="Visitantes" />
        <LegendDot color="#ec4899" label="Respostas" />
        <LegendDot color="#a855f7" label="Leads" />
      </div>
    </div>
  )
}

function RetentionChart({
  data,
}: {
  data: Array<{ label: string; retention_rate: number }>
}) {
  if (data.length === 0) return <EmptyState />

  const width = 1200
  const height = 150
  const padding = { top: 10, right: 8, bottom: 10, left: 8 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = data
    .map((item, index) => {
      const x = padding.left + (index / (data.length - 1 || 1)) * chartW
      const y = padding.top + chartH - (Math.max(0, item.retention_rate) / 100) * chartH
      return `${x},${y}`
    })
    .join(' ')

  const area = `${points} ${padding.left + chartW},${padding.top + chartH} ${padding.left},${padding.top + chartH}`

  const avgRetention = data.length
    ? data.reduce((sum, item) => sum + Math.max(0, item.retention_rate), 0) / data.length
    : 0
  const avgY = padding.top + chartH - (avgRetention / 100) * chartH

  const ticks = [0, 12, 24, 36, 43]

  return (
    <div className="space-y-3">
      <div className="h-[150px] w-full rounded-lg border border-gray-100 bg-cream-50/60 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          <line
            x1={padding.left}
            y1={avgY}
            x2={padding.left + chartW}
            y2={avgY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
          />
          <polygon fill="#f87171" opacity="0.12" points={area} />
          <polyline
            fill="none"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        {ticks.map((tick) => (
          <span key={tick}>{`T${tick}`}</span>
        ))}
      </div>
      <p className="text-right text-xs text-gray-500">
        Retenção média: {percentFormat(avgRetention)}
      </p>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  )
}
