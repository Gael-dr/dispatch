import { ReactNode } from 'react'
import { Card } from '../../engine/card.types'
import { CardView } from './CardView'
import { CardActions } from './CardActions'
import { CardFeedback } from './CardFeedback'

interface CardControllerProps {
  card: Card
  onAction?: (actionId: string) => void
  children?: ReactNode
}

export function CardController({
  card,
  onAction,
  children,
}: CardControllerProps) {
  return (
    <div className="card-controller">
      <CardView card={card} />
      <CardActions card={card} onAction={onAction} />
      <CardFeedback />
      {children}
    </div>
  )
}
