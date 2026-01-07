import { create } from 'zustand'
import { Action, ActionResult } from '../../engine/action.types'
import { cardExecutor } from '../../engine/card.executor'
import { Card } from '../../engine/card.types'
import { generateMockCards } from './mockCards'

export interface CardState {
  // State
  cards: Card[]
  selectedCardId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  removeCard: (cardId: string) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  selectCard: (cardId: string | null) => void
  executeCardAction: (cardId: string, action: Action) => Promise<ActionResult>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Quick Actions
  markCardDone: (cardId: string) => void
  skipCard: (cardId: string) => void

  // Computed
  totalCards: () => number
  doneCards: () => number
  pendingCards: () => number
  progressPercentage: () => number
}

export const useCardStore = create<CardState>((set, get) => ({
  // Initial state
  cards: generateMockCards(9),
  selectedCardId: null,
  isLoading: false,
  error: null,

  // Actions
  setCards: cards => set({ cards }),

  addCard: card =>
    set(state => ({
      cards: [...state.cards, card],
    })),

  removeCard: cardId =>
    set(state => ({
      cards: state.cards.filter(card => card.id !== cardId),
      selectedCardId:
        state.selectedCardId === cardId ? null : state.selectedCardId,
    })),

  updateCard: (cardId, updates) =>
    set(state => ({
      cards: state.cards.map(card =>
        card.id === cardId
          ? { ...card, ...updates, updatedAt: new Date() }
          : card
      ),
    })),

  selectCard: cardId => set({ selectedCardId: cardId }),

  executeCardAction: async (cardId, action) => {
    const state = get()
    const card = state.cards.find(c => c.id === cardId)

    if (!card) {
      return {
        success: false,
        message: 'Card not found',
      }
    }

    set({ isLoading: true, error: null })

    try {
      const result = await cardExecutor.execute(card, action)

      if (result.success) {
        // Optionnel : mettre à jour la carte après l'action
        // get().updateCard(cardId, { ... })
      }

      set({ isLoading: false })
      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      set({ isLoading: false, error: errorMessage })
      return {
        success: false,
        message: errorMessage,
      }
    }
  },

  markCardDone: (cardId: string) => {
    const state = get()

    // Trouver l'index de la carte actuelle avant la mise à jour
    const currentIndex = state.cards.findIndex(card => card.id === cardId)

    if (currentIndex === -1) {
      // Carte non trouvée, rien à faire
      return
    }

    // Mettre à jour la carte comme "done"
    state.updateCard(cardId, { status: 'done' })

    // Récupérer l'état mis à jour après la modification
    const updatedState = get()

    // Trouver la prochaine carte avec le statut "pending" (en excluant celle qu'on vient de marquer)
    const nextCard = updatedState.cards
      .slice(currentIndex + 1) // Chercher après la carte actuelle
      .find(card => card.status === 'pending' && card.id !== cardId)

    // Si aucune carte après, chercher depuis le début (en excluant celle qu'on vient de marquer)
    const firstPendingCard =
      nextCard ||
      updatedState.cards.find(
        card => card.status === 'pending' && card.id !== cardId
      )

    // Sélectionner la prochaine carte "pending" (ou null si aucune)
    updatedState.selectCard(firstPendingCard?.id || null)

    // TODO: appel API backend
    // const response = await fetch(`/api/cards/${cardId}/mark-done`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    // })
  },

  skipCard: (cardId: string) => {
    get().updateCard(cardId, { status: 'skipped' })
    // TODO: appel API backend
    // const response = await fetch(`/api/cards/${cardId}/skip`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    // })
  },

  totalCards: () => get().cards.length,

  doneCards: () => get().cards.filter(c => c.status === 'done').length,

  pendingCards: () => get().cards.filter(c => c.status === 'pending').length,

  progressPercentage: () => {
    const total = get().totalCards()
    return total === 0 ? 0 : Math.round((get().doneCards() / total) * 100)
  },

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  clearError: () => set({ error: null }),
}))
