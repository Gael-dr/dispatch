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
 * Fusionne les actions du backend avec celles de la config.
 * Les actions du backend ont priorité sur celles de la config.
 * Si deux actions ont le même `id`, celle du backend est conservée.
 *
 * @param backendActions - Actions venant du backend (optionnel)
 * @param configActions - Actions définies dans la config (optionnel)
 * @returns Tableau d'actions fusionnées sans doublons
 */
function mergeActions(
  backendActions?: UiAction[],
  configActions?: UiAction[]
): UiAction[] {
  // Si aucune action, retourner un tableau vide
  if (!backendActions && !configActions) {
    return []
  }

  // Si seulement les actions du backend, les retourner telles quelles
  if (backendActions && !configActions) {
    return backendActions
  }

  // Si seulement les actions de la config, les retourner telles quelles
  if (!backendActions && configActions) {
    return configActions
  }

  // Fusion : les actions du backend ont priorité
  const backendActionIds = new Set(backendActions!.map(action => action.id))

  // Commencer par les actions du backend (priorité)
  const merged = [...backendActions!]

  // Ajouter les actions de la config qui n'existent pas déjà
  for (const configAction of configActions!) {
    if (!backendActionIds.has(configAction.id)) {
      merged.push(configAction)
    }
  }

  return merged
}

/**
 * Récupère les actions disponibles pour une carte.
 * Fusionne les actions du backend (si présentes dans la carte) avec celles définies dans la config.
 * Les actions du backend ont priorité sur celles de la config en cas de conflit (même `id`).
 *
 * @param card - La carte pour laquelle récupérer les actions
 * @returns Un tableau d'actions disponibles, fusionnées depuis le backend et la config
 */
export function getAvailableActions(card: Card): UiAction[] {
  // Récupérer la config pour ce type de carte
  const config = cardFactory.getConfig(card.type)

  // Récupérer les actions de la config (si définies)
  const configActions = config?.actions
    ? config.actions(card)
    : undefined

  // Fusionner avec les actions du backend (si présentes dans la carte)
  return mergeActions(card.actions, configActions)
}
