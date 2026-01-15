// Actions principales des cards - Composant dédié aux actions spécifiques à chaque card
import { ComponentProps } from 'react'
import type { UiAction } from '../../engine/policies/card.policy'
import { getButtonTypeForAction } from '../../engine/policies/card.policy'
import { ActionBar } from '../../shared/ui/ActionBar'
import { ActionButton } from '../../shared/ui/ActionButton'
import { Icon } from '../../shared/ui/Icon'
import { useUIStore } from '@/app/store/uiStore'
import type { Card } from '@/engine/cards/card.types'

interface CardActionsProps {
  actions: UiAction[]
  onAction?: (actionId: string) => void
  card?: Card // Ajout de la carte pour passer son ID à la modal
}

/**
 * Liste des actionIds qui nécessitent une modal
 */
const ACTIONS_WITH_MODAL = ['schedule']

export function CardActions({ actions, onAction, card }: CardActionsProps) {
  const openModal = useUIStore(state => state.openModal)

  const handleActionClick = (actionId: string) => {
    // Si l'action nécessite une modal, on l'ouvre
    if (ACTIONS_WITH_MODAL.includes(actionId)) {
      openModal({
        actionId,
        cardId: card?.id,
      })
    } else {
      // Sinon, on appelle directement onAction
      onAction?.(actionId)
    }
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
