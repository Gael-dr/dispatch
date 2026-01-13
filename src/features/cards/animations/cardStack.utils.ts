import { Card } from '../../../engine/cards/card.types'
import {
  ENTRY_ANIMATION,
  EXIT_ANIMATION,
  STACK_PROPERTIES,
} from './cardStack.animations'

/**
 * Propriétés visuelles d'une carte dans le stack
 */
export interface CardVisualProperties {
  zIndex: number
  scale: number
  yOffset: number
  opacity: number
  rotate: number
}

/**
 * Calcule les propriétés visuelles d'une carte en fonction de sa position dans le stack
 *
 * @param index - Index de la carte dans le stack (0 = carte du dessus)
 * @param totalCards - Nombre total de cartes visibles
 * @returns Propriétés visuelles calculées
 */
export function calculateCardProperties(
  index: number,
  totalCards: number
): CardVisualProperties {
  return {
    zIndex: totalCards - index, // La première carte au-dessus
    scale: 1 - index * STACK_PROPERTIES.scaleReduction,
    yOffset: index * STACK_PROPERTIES.stackYOffset,
    opacity: index === 0 ? 1 : 1 - index * STACK_PROPERTIES.opacityReduction,
    rotate:
      index === 0
        ? 0
        : (index % 2 === 0 ? 1 : -1) * STACK_PROPERTIES.rotationAmount,
  }
}

/**
 * Retourne les propriétés d'animation d'entrée par défaut
 * Compatible avec les types de framer-motion
 */
export function getEntryAnimation() {
  return {
    opacity: ENTRY_ANIMATION.initialOpacity,
    scale: ENTRY_ANIMATION.initialScale,
    y: ENTRY_ANIMATION.initialY,
  }
}

/**
 * Crée les propriétés d'animation de sortie pour une carte
 * Style Tinder avec spring physics : rotation prononcée, mouvement fluide et naturel
 * Compatible avec les types de framer-motion
 *
 * @param exitDirection - Direction de sortie en pixels (négatif = gauche, positif = droite)
 * @returns Propriétés d'animation de sortie ou undefined si la carte ne doit pas sortir
 */
export function getExitAnimation(exitDirection: number) {
  if (exitDirection === 0) {
    return undefined
  }

  // Rotation prononcée pour l'effet Tinder
  const rotation =
    exitDirection < 0 ? -EXIT_ANIMATION.rotation : EXIT_ANIMATION.rotation

  return {
    // Translation horizontale avec la direction
    x: exitDirection,
    // Rotation prononcée style Tinder
    rotate: rotation,
    // Opacité qui diminue
    opacity: 0,
    // Scale qui diminue légèrement
    scale: EXIT_ANIMATION.minScale,
    // Transition avec spring physics pour un mouvement naturel
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  }
}

/**
 * Calcule la direction de sortie d'une carte
 *
 * @param cardId - ID de la carte
 * @param exitDirections - Map des directions de sortie connues
 * @param visibleCards - Liste des cartes actuellement visibles
 * @param allCards - Liste complète des cartes (optionnelle)
 * @returns Direction de sortie en pixels (0 si la carte ne sort pas)
 */
export function getCardExitDirection(
  cardId: string,
  exitDirections: Map<string, number>,
  visibleCards: Card[],
  allCards?: Card[]
): number {
  // Vérifier d'abord si on a stocké une direction pour cette carte (elle sort)
  if (exitDirections.has(cardId)) {
    return exitDirections.get(cardId) ?? 0
  }

  // Si la carte est encore visible, pas de direction de sortie
  const isCurrentlyVisible = visibleCards.some(c => c.id === cardId)
  if (isCurrentlyVisible) {
    return 0
  }

  // Sinon, vérifier dans allCards comme fallback
  if (allCards) {
    const card = allCards.find(c => c.id === cardId)
    return card?.status === 'quick-done'
      ? -STACK_PROPERTIES.maxVisibleCards * 100 // Approximation
      : STACK_PROPERTIES.maxVisibleCards * 100
  }

  return 0
}
