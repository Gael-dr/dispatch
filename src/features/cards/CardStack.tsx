import { Card } from '../../engine/card.types'
import { CardController } from './CardController'

interface CardStackProps {
  cards: Card[]
  onCardAction?: (cardId: string, actionId: string) => void
}

export function CardStack({ cards, onCardAction }: CardStackProps) {
  return (
    <div className="card-stack">
      {cards.map(card => (
        <CardController
          key={card.id}
          card={card}
          onAction={actionId => onCardAction?.(card.id, actionId)}
        />
      ))}
    </div>
  )
}
