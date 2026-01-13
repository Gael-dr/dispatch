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
 * Fusionne les actions du backend avec celles du blueprint.
 * Les actions du backend ont priorité sur celles du blueprint.
 * Si deux actions ont le même `id`, celle du backend est conservée.
 *
 * @param backendActions - Actions venant du backend (optionnel)
 * @param blueprintActions - Actions définies dans le blueprint (optionnel)
 * @returns Tableau d'actions fusionnées sans doublons
 */
function mergeActions(
  backendActions?: UiAction[],
  blueprintActions?: UiAction[]
): UiAction[] {
  // Si aucune action, retourner un tableau vide
  if (!backendActions && !blueprintActions) {
    return []
  }

  // Si seulement les actions du backend, les retourner telles quelles
  if (backendActions && !blueprintActions) {
    return backendActions
  }

  // Si seulement les actions du blueprint, les retourner telles quelles
  if (!backendActions && blueprintActions) {
    return blueprintActions
  }

  // Fusion : les actions du backend ont priorité
  const backendActionIds = new Set(
    backendActions!.map(action => action.id)
  )

  // Commencer par les actions du backend (priorité)
  const merged = [...backendActions!]

  // Ajouter les actions du blueprint qui n'existent pas déjà
  for (const blueprintAction of blueprintActions!) {
    if (!backendActionIds.has(blueprintAction.id)) {
      merged.push(blueprintAction)
    }
  }

  return merged
}

/**
 * Récupère les actions disponibles pour une carte.
 * Fusionne les actions du backend (si présentes dans la carte) avec celles définies dans le blueprint.
 * Les actions du backend ont priorité sur celles du blueprint en cas de conflit (même `id`).
 *
 * @param card - La carte pour laquelle récupérer les actions
 * @returns Un tableau d'actions disponibles, fusionnées depuis le backend et le blueprint
 */
export function getAvailableActions(card: Card): UiAction[] {
  const blueprint = cardFactory.getBlueprint(card.type)
  const blueprintActions = blueprint?.actions?.(card)

  // Fusionner les actions du backend (prioritaires) avec celles du blueprint
  return mergeActions(card.actions, blueprintActions)
}
