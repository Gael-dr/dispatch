import { create } from 'zustand'
import type { Card } from '@/engine/cards/card.types'
import { generateMockCards } from './mockCards'
import { fetchCardsFromBackend } from '@/features/cards/cards.api'
import { createCardsFromApiData } from '@/engine/cards/card.utils'

export interface CardState {
  cards: Card[]
  selectedCardId: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean // Indique si les cards ont été chargées au démarrage

  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  removeCard: (cardId: string) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  selectCard: (cardId: string | null) => void

  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  /**
   * Charge les cartes depuis le backend au démarrage de l'application.
   * Utilise les mocks si l'API échoue ou n'est pas disponible.
   */
  loadCards: () => Promise<void>

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
    // TODO backend: PATCH /cards/:id/mark-done
  },

  skipCard: cardId => {
    get().updateCard(cardId, { status: 'skipped' })
    // TODO backend: PATCH /cards/:id/skip
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

  loadCards: async () => {
    // Évite de recharger si déjà initialisé
    if (get().isInitialized) return

    set({ isLoading: true, error: null })

    try {
      // Tenter de charger depuis le backend
      const apiCards = await fetchCardsFromBackend()
      const cards = createCardsFromApiData(apiCards)
      set({ cards, isInitialized: true, isLoading: false })
    } catch (error) {
      // En cas d'erreur (API non disponible, erreur réseau, etc.)
      // Utiliser les mocks pour le développement
      console.warn(
        'Impossible de charger les cartes depuis le backend, utilisation des mocks:',
        error
      )
      const mockCards = generateMockCards(9)
      set({
        cards: mockCards,
        isInitialized: true,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  },
}))
