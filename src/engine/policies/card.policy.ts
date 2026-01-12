import type { Card } from '@/engine/cards/card.types'

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
    { id: 'quick-defer', type: 'defer', label: 'PLUS TARD', requiresConfirmation: false },
    { id: 'quick-urgent', type: 'mark-urgent', label: 'URGENT', requiresConfirmation: false },
    { id: 'quick-done', type: 'mark-done', label: 'FAIT', requiresConfirmation: false },
    { id: 'quick-ignore', type: 'ignore', label: 'IGNORER', requiresConfirmation: false },
  ]
}

/**
 * Actions disponibles par défaut selon le type de card (types connus).
 * Pour les nouveaux types (string), renvoie [].
 */
const DEFAULT_ACTIONS_BY_TYPE: Record<'calendar' | 'notification', UiAction[]> = {
  calendar: [
    { id: 'accept', type: 'approve', label: 'Accepter', icon: 'Check', requiresConfirmation: false },
    { id: 'schedule', type: 'schedule', label: 'Proposer un Créneau', icon: 'Calendar', requiresConfirmation: false },
    { id: 'reject', type: 'reject', label: 'Refuser', icon: 'X', requiresConfirmation: false },
  ],
  notification: [
    { id: 'mark-read', type: 'archive', label: 'Marquer comme lu', requiresConfirmation: false },
    { id: 'dismiss', type: 'archive', label: 'Ignorer', requiresConfirmation: false },
  ],
}

export function getAvailableActions(card: Card): UiAction[] {
  if (card.type === 'calendar') return DEFAULT_ACTIONS_BY_TYPE.calendar
  if (card.type === 'notification') return DEFAULT_ACTIONS_BY_TYPE.notification
  return []
}
