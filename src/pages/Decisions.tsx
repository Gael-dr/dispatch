import { useCardRepo } from '@/app/data/DataProvider'
import { useCardStore } from '@/app/store/cardStore'
import { CardStack } from '@/features/cards/CardStack'
import { UserAvatar } from '@/features/user/UserAvatar'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModalManager } from '@/app/modal/ModalManager'

export default function Decisions() {
  const navigate = useNavigate()
  const repo = useCardRepo()

  const cards = useCardStore(s => s.cards)
  const isLoading = useCardStore(s => s.isLoading)
  const loadCards = useCardStore(s => s.loadCards)

  const doneCards = useCardStore(s => s.doneCards)
  const totalCards = useCardStore(s => s.totalCards)
  const progressPercentage = useCardStore(s => s.progressPercentage)
  const markCardDone = useCardStore(s => s.markCardDone)

  // Si quelqu'un arrive direct sur /decisions (refresh), on charge aussi ici
  useEffect(() => {
    if (cards.length === 0 && !isLoading) {
      loadCards(repo)
    }
  }, [cards.length, isLoading, loadCards, repo])

  // Cards à traiter (pending uniquement)
  const pendingCards = useMemo(
    () => cards.filter(card => card.status === 'pending'),
    [cards]
  )

  // Rediriger vers le dashboard quand il n'y a plus de cards pending
  useEffect(() => {
    if (!isLoading && pendingCards.length === 0 && cards.length > 0) {
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, pendingCards.length, cards.length, navigate])

  const handleCardAction = (cardId: string, actionId: string, data?: unknown) => {
    console.log(`Action ${actionId} sur la carte ${cardId}`, data)
    // TODO: mapper actionId -> action métier / API si besoin
    // Pour l'instant, on marque la carte comme done après l'action
    markCardDone(cardId)
  }

  const handleModalActionConfirm = (actionId: string, data?: unknown) => {
    // Trouver la carte active (première carte pending)
    const activeCard = pendingCards[0]
    if (activeCard) {
      handleCardAction(activeCard.id, actionId, data)
    }
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
            ⚡️ DON&apos;T READ. DECIDE.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-foreground">
            {doneCards()} &nbsp;/&nbsp; {totalCards()}
          </p>
          <UserAvatar />
        </div>
      </div>

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

      {/* Gestionnaire de modals */}
      <ModalManager onActionConfirm={handleModalActionConfirm} />
    </section>
  )
}
