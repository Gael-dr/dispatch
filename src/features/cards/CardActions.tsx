import { Card } from '../../engine/card.types'
import { ActionButton } from '../../shared/ui/ActionButton'
import { ActionBar } from '../../shared/ui/ActionBar'

interface CardActionsProps {
  card: Card
  onAction?: (actionId: string) => void
}

export function CardActions({ card: _card, onAction }: CardActionsProps) {
  // This is device-agnostic - actual interactions are handled in interactions/
  const handleAction = (actionId: string) => {
    onAction?.(actionId)
  }

  return (
    <ActionBar>
      <ActionButton
        label="Approve"
        type="primary"
        onClick={() => handleAction('approve')}
      />
      <ActionButton
        label="Reject"
        type="danger"
        onClick={() => handleAction('reject')}
      />
      <ActionButton
        label="Defer"
        type="secondary"
        onClick={() => handleAction('defer')}
      />
    </ActionBar>
  )
}
