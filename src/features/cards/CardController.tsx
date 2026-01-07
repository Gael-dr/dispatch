import { ReactNode } from 'react'
import { Card } from '../../engine/card.types'
import { CardView } from './CardView'

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
    <div className="card-controller flex flex-col gap-4 px-4">
      <CardView card={card} onAction={onAction} />
      {children}
    </div>
  )
}
