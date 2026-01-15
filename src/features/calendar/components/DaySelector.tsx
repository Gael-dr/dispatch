import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { formatDateInput, formatDisplayDate } from '../utils/calendarDateUtils'

export function DaySelector({
  date,
  onChange,
}: {
  date: string
  onChange: (nextDate: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2">
      <button
        type="button"
        className="text-slate-200 hover:text-white"
        aria-label="Jour précédent"
        onClick={() => {
          if (!date) return
          const next = new Date(`${date}T00:00:00`)
          next.setDate(next.getDate() - 1)
          onChange(formatDateInput(next))
        }}
      >
        <ChevronLeftIcon className="w-6 h-6 text-slate-300" />
      </button>
      <div className="text-sm font-medium text-slate-100 text-center truncate">
        {formatDisplayDate(date)}
      </div>
      <button
        type="button"
        className="text-slate-200 hover:text-white"
        aria-label="Jour suivant"
        onClick={() => {
          if (!date) return
          const next = new Date(`${date}T00:00:00`)
          next.setDate(next.getDate() + 1)
          onChange(formatDateInput(next))
        }}
      >
        <ChevronRightIcon className="w-6 h-6 text-slate-300" />
      </button>
    </div>
  )
}
