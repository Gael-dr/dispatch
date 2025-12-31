import { cn } from '@/lib/utils'
export default function DashboardStatCard({
  numStat,
  textStat,
  color,
  suffix = '',
}: {
    numStat: number
    textStat: string
    color?: string
    suffix?: string
}) {
  return (
    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className={cn("text-2xl font-bold mb-1", color ?? "text-white")} id="stat-decisions">
      {numStat}{suffix}
      </div>
      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
      {textStat}
      </div>
    </div>
  )
}
