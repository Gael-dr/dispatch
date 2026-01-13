import { apiClient } from '@/shared/api/apiClient'
import type { ApiCardData } from '@/engine/cards/card.utils'

/**
 * API pour récupérer les cartes depuis le backend.
 * Les cartes sont chargées au démarrage de l'application.
 */

/**
 * Récupère toutes les cartes depuis le backend.
 * 
 * @returns Tableau de données brutes des cartes depuis l'API
 */
export async function fetchCardsFromBackend(): Promise<ApiCardData[]> {
  // TODO: Adapter l'endpoint selon votre API réelle
  return apiClient.get<ApiCardData[]>('/cards')
}
