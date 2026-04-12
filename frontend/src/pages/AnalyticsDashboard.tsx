import {
  useEffect,
  useMemo,
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

function formatEventValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
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

  const requiredKey = import.meta.env.VITE_ANALYTICS_DASHBOARD_KEY
  const requiredUser = import.meta.env.VITE_ANALYTICS_DASHBOARD_USER
  const requiredPassword = import.meta.env.VITE_ANALYTICS_DASHBOARD_PASSWORD
  const hasLoginCredentials = Boolean(requiredUser && requiredPassword)
  const authStorageKey = 'analytics_dashboard_access'

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
      const response = await getAnalyticsDashboard(5000, 40)
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
  }, [isUnlocked])

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

  const maxEventTypeCount = useMemo(() => {
    if (!data?.events_by_type.length) return 1
    return Math.max(...data.events_by_type.map((item) => item.count), 1)
  }, [data?.events_by_type])

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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gold-500 focus:ring-2"
                  autoComplete="username"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gold-500 focus:ring-2"
                  autoComplete="current-password"
                />
              </>
            ) : (
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Digite a chave"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gold-500 focus:ring-2"
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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-xl border border-gold-400/30 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gold-600">Analytics Dashboard</h1>
            <p className="text-sm text-gray-600">
              Resumo dos eventos enviados para /api/v1/analytics/event
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Eventos" value={data ? numberFormat(data.summary.events_analyzed) : '-'} />
          <StatCard label="Sessões" value={data ? numberFormat(data.summary.sessions) : '-'} />
          <StatCard label="Respostas" value={data ? numberFormat(data.summary.answers) : '-'} />
          <StatCard label="Screen Loaded" value={data ? numberFormat(data.summary.screen_loaded) : '-'} />
          <StatCard label="Screen Time" value={data ? numberFormat(data.summary.screen_time) : '-'} />
          <StatCard label="Emails" value={data ? numberFormat(data.summary.emails_submitted) : '-'} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Eventos por tipo">
            {!data?.events_by_type.length && <EmptyState />}
            {data?.events_by_type.map((item) => {
              const pct = (item.count / maxEventTypeCount) * 100
              return (
                <div key={item.event_type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{item.event_type}</span>
                    <span className="text-gray-500">{numberFormat(item.count)}</span>
                  </div>
                  <div className="h-2 rounded bg-gray-100">
                    <div
                      className="h-2 rounded bg-gold-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </Panel>

          <Panel title="Top respostas">
            {!data?.top_answers.length && <EmptyState />}
            <div className="space-y-2 text-sm">
              {data?.top_answers.slice(0, 12).map((answer, index) => (
                <div key={`${answer.screen_id}-${answer.value}-${index}`} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">Tela {answer.screen_id}</p>
                    <p className="truncate text-gray-500">{answer.value}</p>
                  </div>
                  <span className="whitespace-nowrap text-gray-700">{numberFormat(answer.count)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="Dispositivos">
            <SimpleList
              items={data?.devices.map((item) => ({
                label: item.device,
                value: item.count,
              })) ?? []}
            />
          </Panel>

          <Panel title="Browsers">
            <SimpleList
              items={data?.browsers.map((item) => ({
                label: item.browser,
                value: item.count,
              })) ?? []}
            />
          </Panel>

          <Panel title="UTM Source">
            <SimpleList
              items={data?.utm_sources.map((item) => ({
                label: item.utm_source,
                value: item.count,
              })) ?? []}
            />
          </Panel>
        </section>

        <Panel title="Eventos recentes">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-3">Tipo</th>
                  <th className="py-2 pr-3">Tela</th>
                  <th className="py-2 pr-3">Valor</th>
                  <th className="py-2 pr-3">Sessão</th>
                  <th className="py-2 pr-3">Dispositivo</th>
                  <th className="py-2 pr-3">Browser</th>
                  <th className="py-2 pr-0">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {!data?.recent_events.length && (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Sem eventos recentes.
                    </td>
                  </tr>
                )}
                {data?.recent_events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 align-top last:border-0">
                    <td className="py-2 pr-3 font-medium text-gray-800">{event.event_type}</td>
                    <td className="py-2 pr-3 text-gray-600">{event.screen_id ?? '-'}</td>
                    <td className="max-w-[220px] truncate py-2 pr-3 text-gray-600">
                      {formatEventValue(event.event_value)}
                    </td>
                    <td className="max-w-[180px] truncate py-2 pr-3 text-gray-600">
                      {event.session_id ?? '-'}
                    </td>
                    <td className="py-2 pr-3 text-gray-600">{event.device ?? '-'}</td>
                    <td className="py-2 pr-3 text-gray-600">{event.browser ?? '-'}</td>
                    <td className="py-2 pr-0 text-gray-500">
                      {event.created_at
                        ? new Date(event.created_at).toLocaleString('pt-BR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold-400/20 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function EmptyState() {
  return <p className="text-sm text-gray-500">Sem dados.</p>
}

function SimpleList({
  items,
}: {
  items: Array<{ label: string; value: number }>
}) {
  if (items.length === 0) return <EmptyState />

  return (
    <div className="space-y-2 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
          <span className="text-gray-700">{item.label}</span>
          <span className="font-medium text-gray-900">{numberFormat(item.value)}</span>
        </div>
      ))}
    </div>
  )
}
