import { cn } from '@/lib/utils'
import { AlertTriangle, Info, Sparkles, XCircle } from 'lucide-react'

export default function ContextBubble({
  severity = 'info',
  message,
}: {
  severity?: 'info' | 'warning' | 'error' | 'success'
  message: string | undefined
}) {
  const severityMap = {
    info: {
      Icon: Info,
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
      text: 'text-[#60A6FA]',
      iconText: 'text-[#60A6FA]',
    },
    warning: {
      Icon: AlertTriangle,
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      text: 'text-[#FBBF23]',
      iconText: 'text-[#FBBF23]',
    },
    error: {
      Icon: XCircle,
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      text: 'text-[#F97171]',
      iconText: 'text-[#F97171]',
    },
    success: {
      Icon: Sparkles,
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      text: 'text-[#34D399]',
      iconText: 'text-[#34D399]',
    },
  } as const

  // fallback si severity invalide/indéfini
  const cfg =
    severityMap[(severity as keyof typeof severityMap) ?? 'info'] ??
    severityMap.info

  return (
    <div
      className={cn(
        'flex items-center gap-4 mb-2 rounded-xl px-4 py-4 border',
        cfg.bg,
        cfg.border
      )}
    >
      <div
        className={cn('flex items-center justify-center w-8 h-8 rounded-md')}
      >
        <cfg.Icon className={cn('w-5 h-5', cfg.iconText)} />
      </div>

      <div className="flex flex-col gap-2">
        <p className={cn('text-[10px] font-bold opacity-80', cfg.text)}>
          CONTEXTE
        </p>
        <p className={cn('text-sm font-bold', cfg.text)}>{message} Message</p>
      </div>
    </div>
  )
}
