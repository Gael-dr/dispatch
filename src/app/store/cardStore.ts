import type { Card } from '@/engine/cards/card.types'
import type { CardRepository } from '@/engine/cards/card.repository'
import { create } from 'zustand'

export interface CardState {
  cards: Card[]
  selectedCardId: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean // Indique si les cards ont été chargées au démarrage

  loadCards: (repo: CardRepository) => Promise<void>
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  removeCard: (cardId: string) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  selectCard: (cardId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  markCardDone: (cardId: string) => void
  skipCard: (cardId: string) => void

  totalCards: () => number
  doneCards: () => number
  pendingCards: () => number
  progressPercentage: () => number
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [], // Initialisé vide, chargé au démarrage
  selectedCardId: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  loadCards: async repo => {
    // Évite de recharger si déjà initialisé
    if (get().isInitialized) return

    set({ isLoading: true, error: null })
    try {
      const cards = await repo.list()
      set({ cards, isInitialized: true, isLoading: false })
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  },

  setCards: cards => set({ cards }),
  addCard: card => set(state => ({ cards: [...state.cards, card] })),
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

  markCardDone: cardId => {
    const cardsBefore = get().cards
    const currentIndex = cardsBefore.findIndex(card => card.id === cardId)
    if (currentIndex === -1) return

    get().updateCard(cardId, { status: 'done' })

    const cardsAfter = get().cards
    const next =
      cardsAfter.slice(currentIndex + 1).find(c => c.status === 'pending') ??
      cardsAfter.find(c => c.status === 'pending') ??
      null

    get().selectCard(next?.id ?? null)

    // TODO API: repo.markDone(cardId)
  },

  skipCard: cardId => {
    get().updateCard(cardId, { status: 'skipped' })
    // TODO API: repo.skip(cardId)
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
