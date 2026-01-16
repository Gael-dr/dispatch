// src/features/cards/CardActions.tsx
import type { ComponentProps } from 'react'
import type { UiAction } from '@/engine/policies/card.policy'
import { getButtonTypeForAction } from '@/engine/policies/card.policy'
import { ActionBar } from '@/shared/ui/ActionBar'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Icon } from '@/shared/ui/Icon'
import { useUIStore } from '@/app/store/uiStore'
import type { Card } from '@/engine/cards/card.types'

interface CardActionsProps {
  actions: UiAction[]
  onAction?: (actionId: string) => void
  card?: Card
}

/**
 * Liste des actionIds qui nécessitent une modal
 */
const ACTIONS_WITH_MODAL = ['schedule', 'accept', 'reject'] as const

export function CardActions({ actions, onAction, card }: CardActionsProps) {
  const openModal = useUIStore(state => state.openModal)

  const handleActionClick = (actionId: string) => {
    if (ACTIONS_WITH_MODAL.includes(actionId as any)) {
      openModal({
        actionId,
        cardId: card?.id,
        cardType: card?.type,
        payload: card?.payload,
      })
      return
    }

    onAction?.(actionId)
  }

  return (
    <ActionBar position="top">
      {actions.map(action => (
        <ActionButton
          key={action.id}
          label={action.label}
          icon={action.icon as ComponentProps<typeof Icon>['name'] | undefined}
          buttonType={getButtonTypeForAction(action.type)}
          onClick={() => handleActionClick(action.id)}
        />
      ))}
    </ActionBar>
  )
}
