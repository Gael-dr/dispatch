import type { Appointment } from '@/shared/api/calendar.api'
import { AlertTriangle } from 'lucide-react'
import { formatTime } from '../utils/calendarDateUtils'
import { cn } from '@/lib/utils'

export type SlotMeta = {
  hasOverlap: boolean
  warning: Appointment | null
}

export function TimeSlotGrid({
  times,
  selectedTime,
  slotMeta,
  onSelect,
}: {
  times: string[]
  selectedTime: string | null
  slotMeta: Record<string, SlotMeta>
  onSelect: (time: string) => void
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-2">
      {times
        .filter(time => !slotMeta[time]?.hasOverlap)
        .map(time => {
          const warning = slotMeta[time]?.warning
          const hasWarning = Boolean(warning)
          return (
            <div key={time} className="space-y-1">
              <button
                type="button"
                onClick={() => onSelect(time)}
                className={`
                w-full flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-all gap-2
                ${
                  selectedTime === time
                    ? 'bg-[#1F3743] text-white shadow-md border border-green-500/60'
                    : hasWarning
                      ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/60 hover:bg-yellow-500/30'
                      : 'bg-[#1F3743] text-slate-200 hover:bg-[#1F3743]/80 border'
                }
              `}
              >
                {hasWarning && (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <span
                  className={cn(
                    'font-extrabold text-lg',
                    hasWarning ? 'text-yellow-400' : 'text-[#34D399]'
                  )}
                >
                  {time}
                </span>
                {warning && (
                  <p className="text-[11px] text-yellow-600">
                    <strong>CONFLIT:</strong> {warning.title} (
                    {formatTime(warning.start)}-{formatTime(warning.end)})
                  </p>
                )}
              </button>
            </div>
          )
        })}
    </div>
  )
}
