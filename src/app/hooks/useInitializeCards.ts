import { useEffect } from 'react'
import { useCardStore } from '../store/cardStore'

/**
 * Hook qui charge les cartes au démarrage de l'application.
 * 
 * À utiliser une seule fois dans l'arbre de composants (idéalement dans Providers).
 * Les cartes sont chargées depuis le backend, ou des mocks si l'API n'est pas disponible.
 */
export function useInitializeCards() {
  const loadCards = useCardStore(state => state.loadCards)
  const isInitialized = useCardStore(state => state.isInitialized)

  useEffect(() => {
    // Charge les cartes une seule fois au montage
    if (!isInitialized) {
      loadCards()
    }
  }, [loadCards, isInitialized])
}
