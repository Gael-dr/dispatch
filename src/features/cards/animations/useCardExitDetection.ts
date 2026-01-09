import { useLayoutEffect, useRef, useState } from 'react'
import { Card } from '../../../engine/card.types'
import { ANIMATION_DISTANCES } from './cardStack.animations'

/**
 * Hook personnalisé pour détecter et gérer les cartes qui sortent du stack
 *
 * Ce hook surveille les changements dans la liste des cartes visibles
 * et détermine la direction de sortie basée sur le statut de la carte.
 *
 * @param visibleCardIds - Liste des IDs des cartes actuellement visibles
 * @param allCards - Liste complète des cartes (optionnelle) pour vérifier le statut
 * @returns Map des directions de sortie (cardId -> direction en pixels)
 */
export function useCardExitDetection(
  visibleCardIds: string[],
  allCards?: Card[]
): Map<string, number> {
  const previousCardIds = useRef<Set<string>>(new Set())
  const isInitializedRef = useRef(false)
  const [exitDirections, setExitDirections] = useState<Map<string, number>>(
    new Map()
  )

  useLayoutEffect(() => {
    const currentCardIds = new Set(visibleCardIds)

    // Au premier rendu, initialiser simplement la liste sans déclencher d'animations
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      previousCardIds.current = currentCardIds
      return
    }

    // Trouver les cartes qui ont disparu
    const disappearedCards = Array.from(previousCardIds.current).filter(
      id => !currentCardIds.has(id)
    )

    // Mettre à jour les directions de sortie
    setExitDirections(prev => {
      const newMap = new Map(prev)

      // Pour chaque carte qui a disparu, déterminer sa direction de sortie
      disappearedCards.forEach(cardId => {
        const direction = getExitDirection(cardId, allCards)
        newMap.set(cardId, direction)
      })

      // Nettoyer les directions de sortie pour les cartes qui sont de nouveau visibles
      currentCardIds.forEach(cardId => {
        newMap.delete(cardId)
      })

      // Ne mettre à jour que si quelque chose a changé
      if (
        disappearedCards.length === 0 &&
        Array.from(currentCardIds).every(id => !prev.has(id))
      ) {
        return prev
      }

      return newMap
    })

    // Mettre à jour la liste des cartes précédentes
    previousCardIds.current = currentCardIds
  }, [visibleCardIds, allCards])

  return exitDirections
}

/**
 * Détermine la direction de sortie d'une carte basée sur son statut
 *
 * @param cardId - ID de la carte
 * @param allCards - Liste complète des cartes
 * @returns Direction de sortie en pixels (négatif = gauche, positif = droite)
 */
function getExitDirection(cardId: string, allCards?: Card[]): number {
  if (!allCards) {
    return ANIMATION_DISTANCES.exitHorizontal
  }

  const card = allCards.find(c => c.id === cardId)

  // Sortie vers la gauche si la carte est "quick-done", sinon vers la droite
  return card?.status === 'quick-done'
    ? -ANIMATION_DISTANCES.exitHorizontal
    : ANIMATION_DISTANCES.exitHorizontal
}
