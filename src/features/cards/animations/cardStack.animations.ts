/**
 * Configuration centralisée pour les animations du CardStack
 *
 * Ce fichier contient toutes les constantes et configurations
 * liées aux animations des cartes pour faciliter la maintenance
 * et les ajustements.
 */

/**
 * Durées des animations (en secondes)
 */
export const ANIMATION_DURATIONS = {
  /** Durée de l'animation principale des cartes */
  cardTransition: 0.7,
  /** Durée de l'animation de sortie des cartes - style Tinder (plus rapide) */
  cardExit: 1,
  /** Durée de l'animation de layout (réorganisation) */
  layout: 0.3,
  /** Durée de l'animation de l'indicateur de cartes restantes */
  remainingIndicator: 0.5,
  /** Durée de l'animation du texte dans l'indicateur */
  remainingText: 0.4,
} as const

/**
 * Courbes d'animation (easing functions)
 * Format: [x1, y1, x2, y2] pour cubic-bezier
 */
export const EASING_CURVES = {
  /** Courbe principale pour les transitions de cartes (ease-out) */
  cardTransition: [0.4, 0, 0.2, 1] as const,
  /** Courbe pour les sorties de cartes - style Tinder (plus dynamique) */
  cardExit: [1, 0, 1, 1] as const,
  /** Courbe pour les animations de layout */
  layout: [0.4, 0, 0.2, 1] as const,
} as const

/**
 * Distances et amplitudes des animations
 */
export const ANIMATION_DISTANCES = {
  /** Distance horizontale de sortie des cartes (en pixels) */
  exitHorizontal: 400,
  /** Distance verticale de sortie des cartes (en pixels) */
  exitVertical: 400,
  /** Décalage vertical initial lors de l'entrée (en pixels) */
  initialYOffset: -15,
  /** Décalage vertical entre les cartes du stack (en pixels) */
  stackYOffset: 20,
} as const

/**
 * Propriétés visuelles du stack
 */
export const STACK_PROPERTIES = {
  /** Nombre maximum de cartes visibles dans le stack */
  maxVisibleCards: 3,
  /** Réduction d'échelle par carte (0.05 = 5% de réduction) */
  scaleReduction: 0.05,
  /** Réduction d'opacité par carte (0.15 = 15% de réduction) */
  opacityReduction: 0.15,
  /** Rotation alternée pour les cartes du dessous (en degrés) */
  rotationAmount: 0,
  /** Délai progressif entre les animations de chaque carte (en secondes) */
  cascadeDelay: 0.05,
  /** Délai avant que la carte suivante monte après la sortie de la précédente (en secondes) */
  nextCardDelay: 0.15,
} as const

/**
 * Propriétés d'animation de sortie
 */
export const EXIT_ANIMATION = {
  /** Rotation lors de la sortie (en degrés) - style Tinder */
  rotation: 20,
  /** Timing de l'opacité : [début, maintien, fin] en pourcentage */
  opacityTiming: [0, 0.5, 1] as const,
  /** Courbe d'easing pour l'opacité lors de la sortie */
  opacityEasing: [0.4, 0, 0.5, 1] as const,
  /** Échelle minimale lors de la sortie (effet de zoom out) */
  minScale: 0.9,
  /** Décalage vertical lors de la sortie (en pixels) */
  yOffset: 100,
} as const

/**
 * Propriétés d'animation d'entrée
 */
export const ENTRY_ANIMATION = {
  /** Opacité initiale */
  initialOpacity: 0,
  /** Échelle initiale */
  initialScale: 0.9,
  /** Position Y initiale */
  initialY: ANIMATION_DISTANCES.initialYOffset,
} as const

/**
 * Configuration complète de la transition des cartes
 */
export const cardTransition = {
  duration: ANIMATION_DURATIONS.cardTransition,
  ease: EASING_CURVES.cardTransition,
} as const

/**
 * Configuration complète de la transition de sortie
 */
export const cardExitTransition = {
  duration: ANIMATION_DURATIONS.cardExit,
  ease: EASING_CURVES.cardExit,
} as const

/**
 * Configuration de la transition de layout
 */
export const layoutTransition = {
  duration: ANIMATION_DURATIONS.layout,
  ease: EASING_CURVES.layout,
} as const
