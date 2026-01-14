import type { Card, CardTypeId } from './card.types'
import type { UiAction } from '@/engine/policies/card.policy'

/**
 * Configuration d'un type de carte pour la production.
 *
 * Les mocks sont gérés séparément via les fixtures JSON dans `src/app/store/fixtures/`.
 */
export type CardConfig<TPayload = unknown> = {
  /**
   * Identifiant unique du type de carte.
   */
  type: CardTypeId

  /**
   * Connecteurs possibles/requis pour ce type de carte.
   * Utilisé comme fallback si non fourni par le backend.
   */
  connectors?: string[]

  /**
   * Actions spécifiques à ce type de carte.
   * Peut être une fonction pour des actions dynamiques basées sur la carte.
   * Les actions sont récupérées via `getAvailableActions(card)`.
   */
  actions?: (card: Card<TPayload>) => UiAction[]
}
