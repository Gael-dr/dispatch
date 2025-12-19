import { useCardStore } from '@/app/store/cardStore'
import { CardStack } from '@/features/cards/CardStack'
import { useMemo } from 'react'

export default function Decisions() {
  const cards = useCardStore(state => state.cards)

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = cards.length
    const processed = cards.filter(card => {
      // Nouvelle structure : status dans payload
      if (card.payload && typeof card.payload === 'object') {
        const payload = card.payload as Record<string, unknown>
        return payload.status === 'processed'
      }
      // Compatibilité ancienne structure
      const legacyCard = card as unknown as {
        metadata?: Record<string, unknown>
      }
      return legacyCard.metadata?.status === 'processed'
    }).length
    const pending = total - processed
    const progress = total > 0 ? (processed / total) * 100 : 0

    return { total, processed, pending, progress }
  }, [cards])

  // Filtrer les cartes non traitées pour l'affichage
  const pendingCards = useMemo(
    () =>
      cards.filter(card => {
        // Nouvelle structure : status dans payload
        if (card.payload && typeof card.payload === 'object') {
          const payload = card.payload as Record<string, unknown>
          return payload.status !== 'processed'
        }
        // Compatibilité ancienne structure
        const legacyCard = card as unknown as {
          metadata?: Record<string, unknown>
        }
        return legacyCard.metadata?.status !== 'processed'
      }),
    [cards]
  )

  const handleCardAction = (cardId: string, actionId: string) => {
    console.log(`Action ${actionId} sur la carte ${cardId}`)
    // Ici vous pouvez gérer les actions sur les cartes
  }

  return (
    <section
      className="flex flex-col h-screen w-screen px-4 pt-10 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.2069 0.0403 263.99)' }}
    >
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex flex-col justify-start mb-1">
          <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
            DISPATCH
          </h1>
          <p className="text-slate-400 font-bold tracking-wide text-xs opacity-80">
            ⚡️ DON'T READ. DECIDE.
          </p>
        </div>
        {/* Compteur de cartes */}
        <p className="text-sm font-semibold text-foreground">
          {stats.processed} &nbsp;/&nbsp; {stats.total}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="w-full mb-2">
        <div className="w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-lg">
          <CardStack cards={pendingCards} onCardAction={handleCardAction} />
        </div>
      </div>
    </section>
  )
}
