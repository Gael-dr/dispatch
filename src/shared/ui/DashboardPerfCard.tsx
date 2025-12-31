import React from 'react'

export type PerfMetric = {
  label: string
  value: React.ReactNode
  valueClassName?: string
}

export type DashboardPerfCardProps = {
  title?: string
  metrics?: PerfMetric[]
  className?: string
}

const defaultMetrics: PerfMetric[] = [
  { label: 'Décisions', value: 42 },
  { label: 'Traités', value: 840 },
  { label: 'Gagnées', value: '3h15', valueClassName: 'text-emerald-400' },
]

export default function DashboardPerfCard({
  title = 'Performance Semaine',
  metrics = defaultMetrics,
  className = '',
}: DashboardPerfCardProps) {
  const cols = Math.min(Math.max(metrics.length, 1), 4) // clamp entre 1 et 4
  const colsClass = [
    '',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
  ][cols]
  const hasDivider = metrics.length > 1

  return (
    <div
      className={`w-full bg-slate-800/40 rounded-2xl p-5 border border-slate-800 mb-6 shrink-0 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
        <i className="ph-fill ph-calendar-check text-slate-400"></i>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          {title}
        </span>
      </div>

      <div
        className={`grid ${colsClass} gap-2 ${hasDivider ? 'divide-x divide-slate-800' : ''}`}
      >
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              // appliquer la couleur personnalisée si fournie, sinon fallback sur text-white
              className={`text-lg font-bold ${m.valueClassName ?? 'text-white'}`}
            >
              {m.value}
            </div>
            <div className="text-[8px] text-slate-500 uppercase font-bold mt-1">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
