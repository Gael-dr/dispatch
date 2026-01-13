import type { Card } from './card.types'
import { cardFactory } from './factory'

/**
 * Type pour les données brutes reçues de l'API.
 * Les dates sont représentées comme des strings ISO.
 */
export type ApiCardData<TPayload = unknown> = Omit<
  Card<TPayload>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string | Date
  updatedAt: string | Date
  payload: TPayload | ApiPayloadData<TPayload>
}

/**
 * Type pour les payloads API qui peuvent contenir des dates en string.
 */
type ApiPayloadData<T> = T extends Date
  ? string | Date
  : T extends Array<infer U>
    ? Array<ApiPayloadData<U>>
    : T extends object
      ? {
          [K in keyof T]: ApiPayloadData<T[K]>
        }
      : T

/**
 * Normalise récursivement les dates dans un objet.
 * Convertit les strings ISO en objets Date.
 * 
 * Détecte automatiquement les formats ISO 8601 courants :
 * - "2024-01-15T10:30:00.000Z"
 * - "2024-01-15T10:30:00Z"
 * - "2024-01-15T10:30:00"
 */
function normalizeDates<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    // Tente de parser la string comme une date ISO
    // Date.parse() retourne un timestamp si c'est une date valide, NaN sinon
    const trimmed = obj.trim()
    const timestamp = Date.parse(trimmed)
    if (!isNaN(timestamp)) {
      // Vérifie que la string correspond bien à un format de date ISO (évite les faux positifs)
      // Les formats ISO commencent par YYYY-MM-DD et peuvent avoir un T suivi de l'heure
      // Pattern simplifié pour éviter les problèmes d'échappement
      // Accepte: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS, YYYY-MM-DDTHH:MM:SS.ms, avec Z ou timezone
      const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
      const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:?\d{2})?$/
      
      if (dateOnlyPattern.test(trimmed) || dateTimePattern.test(trimmed)) {
        return new Date(timestamp) as unknown as T
      }
    }
    return obj
  }

  if (obj instanceof Date) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeDates(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const normalized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      normalized[key] = normalizeDates(value)
    }
    return normalized as T
  }

  return obj
}

/**
 * Crée une Card à partir de données reçues de l'API.
 * 
 * Cette fonction :
 * 1. Normalise les dates (string ISO -> Date)
 * 2. Utilise le CardFactory pour créer la carte avec toutes les données du backend
 * 3. S'assure que le blueprint est enregistré pour le type de carte
 * 
 * @param apiData - Données brutes reçues de l'API
 * @returns Card normalisée avec toutes les dates converties
 * 
 * @example
 * ```typescript
 * const apiResponse = await fetch('/api/cards')
 * const apiCards = await apiResponse.json()
 * const cards = apiCards.map((apiCard: ApiCardData) => 
 *   createCardFromApiData(apiCard)
 * )
 * useCardStore.getState().setCards(cards)
 * ```
 */
export function createCardFromApiData<TPayload = unknown>(
  apiData: ApiCardData<TPayload>
): Card<TPayload> {
  // Normaliser les dates dans le payload
  const normalizedPayload = normalizeDates(apiData.payload) as TPayload

  // Normaliser les dates de la carte elle-même
  const createdAt =
    apiData.createdAt instanceof Date
      ? apiData.createdAt
      : new Date(apiData.createdAt)
  const updatedAt =
    apiData.updatedAt instanceof Date
      ? apiData.updatedAt
      : new Date(apiData.updatedAt)

  // Utiliser cardFactory.create() avec toutes les données du backend comme overrides
  // Cela garantit que toutes les valeurs viennent du backend, pas des factories de mock
  return cardFactory.create<TPayload>(apiData.type, {
    id: apiData.id,
    title: apiData.title,
    priority: apiData.priority,
    status: apiData.status,
    payload: normalizedPayload,
    createdAt,
    updatedAt,
    connectors: apiData.connectors,
  })
}

/**
 * Crée plusieurs Cards à partir d'un tableau de données API.
 * 
 * @param apiCards - Tableau de données brutes reçues de l'API
 * @returns Tableau de Cards normalisées
 */
export function createCardsFromApiData<TPayload = unknown>(
  apiCards: ApiCardData<TPayload>[]
): Card<TPayload>[] {
  return apiCards.map(createCardFromApiData)
}
