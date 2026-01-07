import { useCardStore } from '@/app/store/cardStore'
import { CardStack } from '@/features/cards/CardStack'
import { UserAvatar } from '@/features/user/UserAvatar'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Decisions() {
  const { doneCards, totalCards, progressPercentage, cards, markCardDone } =
    useCardStore()
  const navigate = useNavigate()

  // Calculer les statistiques
  // const stats = useMemo(() => {
  //   const total = cards.length
  //   const processed = cards.filter(card => {
  //     // Nouvelle structure : status dans payload
  //     if (card.payload && typeof card.payload === 'object') {
  //       const payload = card.payload as Record<string, unknown>
  //       return payload.status === 'processed'
  //     }
  //     // Compatibilité ancienne structure
  //     const legacyCard = card as unknown as {
  //       metadata?: Record<string, unknown>
  //     }
  //     return legacyCard.metadata?.status === 'processed'
  //   }).length
  //   const pending = total - processed
  //   const progress = total > 0 ? (processed / total) * 100 : 0

  //   return { total, processed, pending, progress }
  // }, [cards])

  // Filtrer les cartes non traitées pour l'affichage
  const pendingCards = useMemo(
    () => cards.filter(card => card.status !== 'done'),
    [cards]
  )

  // Rediriger vers le dashboard quand il n'y a plus de cartes
  useEffect(() => {
    if (pendingCards.length === 0 && cards.length > 0) {
      // Attendre un court délai pour laisser l'animation de la dernière carte se terminer
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pendingCards.length, cards.length, navigate])

  const handleCardAction = (cardId: string, actionId: string) => {
    console.log(`Action ${actionId} sur la carte ${cardId}`)
    // Ici vous pouvez gérer les actions sur les cartes

    markCardDone(cardId)
  }

  return (
    <section
      className="flex flex-col h-screen w-screen pt-10 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.2069 0.0403 263.99)' }}
    >
      <div className="flex flex-row justify-between items-center mb-4 px-4">
        <div className="flex flex-col justify-start mb-1">
          <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
            DISPATCH
          </h1>
          <p className="text-slate-400 font-bold tracking-wide text-xs opacity-80">
            ⚡️ DON'T READ. DECIDE.
          </p>
        </div>
        {/* Compteur de cartes & avatar */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-foreground">
            {doneCards()} &nbsp;/&nbsp; {totalCards()}
          </p>
          <UserAvatar />
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full mb-2 px-4">
        <div className="w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage()}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-lg flex-1 mx-auto">
        <CardStack
          cards={pendingCards}
          allCards={cards}
          onCardAction={handleCardAction}
        />
      </div>
    </section>
  )
}
