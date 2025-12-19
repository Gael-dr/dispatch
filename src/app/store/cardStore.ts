import { create } from 'zustand'
import { Card } from '../../engine/card.types'
import { Action, ActionResult } from '../../engine/action.types'
import { cardExecutor } from '../../engine/card.executor'
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

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  clearError: () => set({ error: null }),
}))
