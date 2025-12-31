import DashboardPerfCard from '@/shared/ui/DashboardPerfCard'
import DashboardStatCard from '@/shared/ui/DashboardStatCard'
import { CheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <main
      className="flex flex-col h-screen w-screen px-4 pt-10 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.2069 0.0403 263.99)' }}
    >
      <section className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-6 shrink-0">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center relative shadow-2xl rotate-3">
            <CheckIcon className="w-10 h-10 text-white rotate--3" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
          Inbox Zero.
        </h1>
        <p className="text-slate-400 mb-6 text-xs">
          Mission accomplie. Session terminée.
        </p>
        <div className="grid grid-cols-2 gap-3 w-full mb-6 shrink-0">
          <DashboardStatCard
            numStat={9}
            textStat="DÉCISIONS"
            color="text-white"
          />
          <DashboardStatCard
            numStat={45}
            suffix="m"
            textStat="TEMPS GAGNÉ"
            color="text-blue-400"
          />
          <DashboardStatCard
            numStat={142}
            textStat="TRAITÉS IA"
            color="text-slate-300"
          />
          <DashboardStatCard
            numStat={4}
            textStat="AUTO-ACTIONS"
            color="text-purple-400"
          />
        </div>
        <DashboardPerfCard />
        <Link to="/">
          <p className="uppercase text-sm font-bold text-slate-500">
            NOUVELLES DÉCISIONS
          </p>
        </Link>
      </section>
    </main>
  )
}
