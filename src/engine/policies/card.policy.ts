import type { Card } from '@/engine/cards/card.types'
import { cardFactory } from '@/engine/cards/factory'

export type UiButtonType = 'primary' | 'secondary' | 'destructive'

export type UiActionType =
  | 'approve'
  | 'reject'
  | 'defer'
  | 'archive'
  | 'schedule'
  | 'read'
  | 'mark-urgent'
  | 'mark-done'
  | 'ignore'
  | 'custom'

export type UiAction = {
  id: string
  type: UiActionType
  label: string
  requiresConfirmation?: boolean
  icon?: string
}

/**
 * Mapping centralisé : action → style de bouton
 */
const ACTION_TO_BUTTON_TYPE: Record<UiActionType, UiButtonType> = {
  approve: 'primary',
  reject: 'destructive',
  defer: 'secondary',
  archive: 'secondary',
  schedule: 'secondary',
  read: 'secondary',
  'mark-urgent': 'primary',
  'mark-done': 'secondary',
  ignore: 'destructive',
  custom: 'secondary',
}

export function getButtonTypeForAction(actionType: UiActionType): UiButtonType {
  return ACTION_TO_BUTTON_TYPE[actionType] || 'secondary'
}

/**
 * Actions rapides globales
 */
export function getQuickActions(): UiAction[] {
  return [
    {
      id: 'quick-defer',
      type: 'defer',
      label: 'PLUS TARD',
      requiresConfirmation: false,
    },
    {
      id: 'quick-urgent',
      type: 'mark-urgent',
      label: 'URGENT',
      requiresConfirmation: false,
    },
    {
      id: 'quick-done',
      type: 'mark-done',
      label: 'FAIT',
      requiresConfirmation: false,
    },
    {
      id: 'quick-ignore',
      type: 'ignore',
      label: 'IGNORER',
      requiresConfirmation: false,
    },
  ]
}

/**
 * Récupère les actions disponibles pour une carte.
 * Les actions sont maintenant définies dans le blueprint de chaque type de carte.
 *
 * @param card - La carte pour laquelle récupérer les actions
 * @returns Un tableau d'actions disponibles, ou un tableau vide si aucune action n'est définie
 */
export function getAvailableActions(card: Card): UiAction[] {
  const blueprint = cardFactory.getBlueprint(card.type)

  if (blueprint?.actions) {
    return blueprint.actions(card)
  }

  return []
}
