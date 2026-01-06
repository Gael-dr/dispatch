// Actions principales des cards - Composant dédié aux actions spécifiques à chaque card
import { ComponentProps } from 'react'
import { Action } from '../../engine/action.types'
import { getButtonTypeForAction } from '../../engine/policies/card.policy'
import { ActionBar } from '../../shared/ui/ActionBar'
import { ActionButton } from '../../shared/ui/ActionButton'
import { Icon } from '../../shared/ui/Icon'

interface CardActionsProps {
  actions: Action[]
  onAction?: (actionId: string) => void
}

export function CardActions({ actions, onAction }: CardActionsProps) {
  return (
    <ActionBar position="top">
      {actions.map(action => (
        <ActionButton
          key={action.id}
          label={action.label}
          icon={action.icon as ComponentProps<typeof Icon>['name'] | undefined}
          buttonType={getButtonTypeForAction(action.type)}
          onClick={() => onAction?.(action.id)}
        />
      ))}
    </ActionBar>
  )
}
