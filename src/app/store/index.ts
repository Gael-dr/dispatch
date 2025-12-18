/**
 * Store configuration avec Zustand
 *
 * Ce fichier exporte tous les stores de l'application.
 * Chaque store gère une partie spécifique de l'état de l'application.
 */

import { useCardStore } from './cardStore'
import { useUIStore } from './uiStore'

// Stores
export { useCardStore } from './cardStore'
export { useUIStore } from './uiStore'

// Types
export type { CardState } from './cardStore'
export type { UIState } from './uiStore'

/**
 * Hook pour accéder à plusieurs stores en même temps
 *
 * @example
 * ```tsx
 * const { cards, isLoading } = useAppStore()
 * ```
 */
export function useAppStore() {
  const cards = useCardStore(state => state.cards)
  const isLoading = useCardStore(state => state.isLoading)
  const selectedCardId = useCardStore(state => state.selectedCardId)
  const sidebarOpen = useUIStore(state => state.sidebarOpen)
  const theme = useUIStore(state => state.theme)

  return {
    cards,
    isLoading,
    selectedCardId,
    sidebarOpen,
    theme,
  }
}
