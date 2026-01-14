import { useEffect } from 'react'
import { useCardStore } from '../store/cardStore'
import { useCardRepo } from '../data/DataProvider'

/**
 * Hook qui charge les cartes au démarrage de l'application.
 *
 * À utiliser une seule fois dans l'arbre de composants (idéalement dans Providers).
 * Les cartes sont chargées depuis le repository (JSON en dev, API en prod).
 */
export function useInitializeCards() {
  const loadCards = useCardStore(state => state.loadCards)
  const isInitialized = useCardStore(state => state.isInitialized)
  const repo = useCardRepo()

  useEffect(() => {
    // Charge les cartes une seule fois au montage
    if (!isInitialized) {
      loadCards(repo)
    }
  }, [loadCards, isInitialized, repo])
}
