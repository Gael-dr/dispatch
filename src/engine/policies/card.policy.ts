// Card policy - Détermine les règles produit pour les cards
// ❌ Aucune dépendance à React, DOM, ou UI

import { Action } from '../action.types'
import { Card } from '../card.types'

/**
 * Mapping centralisé : type d'action métier → type de bouton UI
 * 📝 Un seul endroit pour modifier tous les mappings
 */
const ACTION_TO_BUTTON_TYPE: Record<
  Action['type'],
  'primary' | 'secondary' | 'destructive'
> = {
  approve: 'primary',
  reject: 'destructive',
  defer: 'secondary',
  archive: 'secondary',
  schedule: 'primary',
  read: 'secondary',
  'mark-urgent': 'primary',
  'mark-done': 'secondary',
  ignore: 'destructive',
  custom: 'secondary',
}

/**
 * Actions rapides globales - Toujours les mêmes pour toutes les cards
 */
export function getQuickActions(): Action[] {
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
 * Récupère les actions disponibles pour une card selon son type
 */
export function getAvailableActions(card: Card): Action[] {
  if ('actions' in card && Array.isArray(card.actions)) {
    return card.actions as Action[]
  }

  // Actions par défaut selon le type de card
  const defaultActions: Record<Card['type'], Action[]> = {
    calendar: [
      {
        id: 'accept',
        type: 'approve',
        label: 'Accepter',
        requiresConfirmation: false,
      },
      {
        id: 'decline',
        type: 'reject',
        label: 'Refuser',
        requiresConfirmation: false,
      },
      {
        id: 'tentative',
        type: 'defer',
        label: 'Peut-être',
        requiresConfirmation: false,
      },
    ],
    notification: [
      {
        id: 'mark-read',
        type: 'archive',
        label: 'Marquer comme lu',
        requiresConfirmation: false,
      },
      {
        id: 'dismiss',
        type: 'archive',
        label: 'Ignorer',
        requiresConfirmation: false,
      },
    ],
  }

  return defaultActions[card.type] || []
}

/**
 * Mappe un type d'action vers un type de bouton UI
 */
export function getButtonTypeForAction(
  actionType: Action['type']
): 'primary' | 'secondary' | 'destructive' {
  return ACTION_TO_BUTTON_TYPE[actionType] || 'secondary'
}
