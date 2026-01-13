import { useCardStore } from '@/app/store/cardStore'
import { SwipeToUnlock } from '@/shared/ui/SwipeToUnlock'
import { PlusCircleIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const cards = useCardStore(state => state.cards)
  const cardCount = cards.length

  const handleUnlock = () => {
    navigate('/decisions')
  }

  return (
    <section className="home flex flex-col items-center justify-center h-screen w-screen text-center overflow-hidden">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-3xl bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <PlusCircleIcon className="w-11 h-11 text-blue-400" />
        </div>
        <h1 className="brand-text">DISPATCH</h1>
        <p className="text-slate-400 mb-6 font-bold tracking-wide leading-tight text-sm opacity-80">
          Decision Operating System
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mb-8"></div>

      <div className="px-6 w-full max-w-sm">
        <p className="text-sm font-bold text-white mb-6 tracking-tight">
          Vous avez{' '}
          <span className="text-blue-400">
            {cardCount} décision{cardCount > 1 ? 's' : ''}
          </span>{' '}
          à prendre
        </p>
        <SwipeToUnlock onUnlock={handleUnlock} label="GLISSER POUR TRAITER" />
      </div>
    </section>
  )
}
