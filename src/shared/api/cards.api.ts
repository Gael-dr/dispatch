import type { CardDTO } from '@/app/store/fixtures/cards.dto'
import { apiClient } from './apiClient'

/**
 * API centralisée pour les cartes.
 *
 * Tous les appels API liés aux cartes passent par ce fichier.
 */

/**
 * Récupère toutes les cartes depuis le backend.
 *
 * @returns Tableau de CardDTO depuis l'API
 */
export async function fetchCards(): Promise<CardDTO[]> {
  return apiClient.get<CardDTO[]>('/cards')
}

/**
 * Marque une carte comme terminée.
 *
 * @param cardId - ID de la carte à marquer comme terminée
 */
export async function markCardDone(cardId: string): Promise<void> {
  return apiClient.put<void>(`/cards/${cardId}/done`, {})
}

/**
 * Ignore une carte.
 *
 * @param cardId - ID de la carte à ignorer
 */
export async function skipCard(cardId: string): Promise<void> {
  return apiClient.put<void>(`/cards/${cardId}/skip`, {})
}

/**
 * Exécute une action sur une carte.
 *
 * @param cardId - ID de la carte
 * @param actionId - ID de l'action à exécuter
 * @param data - Données optionnelles pour l'action
 */
export async function executeCardAction(
  cardId: string,
  actionId: string,
  data?: unknown
): Promise<void> {
  return apiClient.post<void>(`/cards/${cardId}/actions/${actionId}`, data ?? {})
}
