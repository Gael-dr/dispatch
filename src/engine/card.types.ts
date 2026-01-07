// Card types definition
// ❌ Aucune dépendance à React, DOM, ou UI
// ✅ Code pur, testable, prévisible

import { Action } from './action.types'

/**
 * Type de card - doit être une union type pour la sécurité de type
 * Ajoutez ici vos nouveaux types de cards
 */
export type CardType = 'calendar' | 'notification'

/**
 * Card - Structure déclarative selon les règles
 *
 * Une card est une donnée déclarative, jamais un composant.
 * Elle contient :
 * - un type
 * - un payload (données métier)
 * - une liste d'actions possibles
 */
export interface Card {
  id: string
  type: CardType
  status: string
  payload: unknown // Données métier spécifiques au type de card
  actions?: Action[] // Actions disponibles pour cette card
  createdAt: Date
  updatedAt: Date
}

/**
 * Type helper pour créer des cards typées
 */
export type TypedCard<T extends CardType, P = unknown> = Omit<
  Card,
  'type' | 'payload'
> & {
  type: T
  payload: P
}

/**
 * @deprecated - Utiliser Card avec payload à la place
 * Gardé pour compatibilité temporaire
 */
export interface LegacyCard {
  id: string
  type: string
  title: string
  content?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}
