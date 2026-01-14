/**
 * API centralisée - Tous les appels API passent par ce module.
 *
 * Structure :
 * - `apiClient.ts` : Client HTTP de base (GET, POST, PUT, DELETE)
 * - `cards.api.ts` : Fonctions spécifiques pour les cartes
 */

export * from './apiClient'
export * from './cards.api'
