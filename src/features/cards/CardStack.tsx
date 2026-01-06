import { Card } from '../../engine/card.types'
import { CardController } from './CardController'
import { QuickActions } from './QuickActions'

interface CardStackProps {
  cards: Card[]
  onCardAction?: (cardId: string, actionId: string) => void
}

export function CardStack({ cards, onCardAction }: CardStackProps) {
  // Afficher seulement les 3 premières cartes pour l'effet de stack
  const visibleCards = cards.slice(0, 3)
  const remainingCount = Math.max(0, cards.length - 3)
  // La première card est celle qui est active/interactive
  const activeCard = visibleCards[0]

  // Handler pour les actions rapides - gère la card active
  const handleQuickAction = (actionId: string) => {
    if (activeCard) {
      onCardAction?.(activeCard.id, actionId)
    }
  }

  return (
    <div className="relative w-full min-h-125 max-h-175 h-[70vh] sm:h-150 md:h-162.5 flex flex-col items-center pt-4">
      {visibleCards.map((card, index) => {
        // Calculer les transformations pour l'effet de stack
        const scale = 1 - index * 0.05 // Chaque carte est légèrement plus petite
        const yOffset = index * 10 // Décalage vertical
        const zIndex = visibleCards.length - index // La première carte au-dessus
        const opacity = index === 0 ? 1 : 1 - index * 0.15 // Légère transparence pour les cartes du dessou
        const rotate = index === 0 ? 0 : (index % 2 === 0 ? 1 : -1) * 0.5 // Légère rotation alternée

        return (
          <div
            key={card.id}
            className="absolute w-full"
            style={{
              transform: `translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`,
              zIndex,
              opacity,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              pointerEvents: index === 0 ? 'auto' : 'none', // Seule la première carte est interactive
            }}
          >
            <CardController
              card={card}
              onAction={actionId => onCardAction?.(card.id, actionId)}
            />
          </div>
        )
      })}

      {/* Indicateur pour les cartes restantes */}
      {remainingCount > 0 && (
        <div
          className="absolute w-full flex items-center justify-center"
          style={{
            transform: `translateY(${visibleCards.length * 10}px) scale(${1 - visibleCards.length * 0.05})`,
            zIndex: 0,
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        >
          <div className="w-full min-h-100 max-h-150 h-[60vh] sm:h-125 md:h-137.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-semibold">
              +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* QuickActions - Une seule fois, en bas, gère la card active */}
      {activeCard && (
        <div className="absolute bottom-0 w-full z-50">
          <QuickActions onAction={handleQuickAction} />
        </div>
      )}
    </div>
  )
}
