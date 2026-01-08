import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '../../engine/card.types'
import { CardController } from './CardController'
import { QuickActions } from './QuickActions'
import { ANIMATION_DISTANCES, STACK_PROPERTIES } from './animations'

interface CardStackProps {
  cards: Card[]
  allCards?: Card[] // Liste complète pour vérifier le statut des cartes qui sortent (non utilisé pour l'instant)
  onCardAction?: (cardId: string, actionId: string) => void
}

export function CardStack({
  cards,
  allCards: _allCards,
  onCardAction,
}: CardStackProps) {
  // État pour gérer les cartes qui sortent (comme dans l'exemple)
  const [leavingCardId, setLeavingCardId] = useState<string | null>(null)
  const [leavingDirection, setLeavingDirection] = useState<
    'left' | 'right' | 'bottom' | null
  >(null)
  const [leavingCard, setLeavingCard] = useState<Card | null>(null)
  // État pour afficher le tag urgent
  const [showUrgentTag, setShowUrgentTag] = useState(false)
  const [urgentTagCardId, setUrgentTagCardId] = useState<string | null>(null)

  // Afficher seulement les 3 premières cartes + la carte qui sort
  const visibleCards = useMemo(() => {
    const baseCards = cards.slice(0, STACK_PROPERTIES.maxVisibleCards)
    // Ajouter la carte qui sort si elle existe et n'est pas déjà dans baseCards
    if (leavingCard && !baseCards.some(c => c.id === leavingCard.id)) {
      return [leavingCard, ...baseCards]
    }
    return baseCards
  }, [cards, leavingCard])

  const remainingCount = Math.max(
    0,
    cards.length - STACK_PROPERTIES.maxVisibleCards
  )

  // La première card est celle qui est active/interactive (pas celle qui sort)
  const activeCard = cards[0]

  // Handler pour les actions rapides - gère la card active
  const handleQuickAction = (actionId: string) => {
    if (activeCard && !leavingCardId) {
      // Déterminer la direction de sortie basée sur l'action
      // quick-done = droite, quick-ignore = gauche, quick-defer/quick-urgent = bas, autres = droite
      let direction: 'left' | 'right' | 'bottom' = 'right'
      if (actionId === 'quick-done') {
        direction = 'right'
      } else if (actionId === 'quick-ignore') {
        direction = 'left'
      } else if (actionId === 'quick-defer' || actionId === 'quick-urgent') {
        direction = 'bottom'
      }

      // Pour quick-urgent, afficher le tag avant l'animation
      if (actionId === 'quick-urgent') {
        setUrgentTagCardId(activeCard.id)
        setShowUrgentTag(true)

        // Démarrer l'animation après un délai plus long pour voir le tag
        setTimeout(() => {
          setLeavingCard(activeCard)
          setLeavingCardId(activeCard.id)
          setLeavingDirection(direction)
          setShowUrgentTag(false)

          // Appeler l'action après un délai pour laisser l'animation se jouer
          setTimeout(() => {
            onCardAction?.(activeCard.id, actionId)
            // Réinitialiser après l'animation
            setTimeout(() => {
              setLeavingCardId(null)
              setLeavingDirection(null)
              setLeavingCard(null)
              setUrgentTagCardId(null)
            }, 500)
          }, 500)
        }, 800) // Délai pour voir le tag (augmenté de 200ms à 800ms)
      } else {
        // Pour les autres actions, animation immédiate
        setLeavingCard(activeCard)
        setLeavingCardId(activeCard.id)
        setLeavingDirection(direction)

        // Appeler l'action après un court délai pour laisser l'animation se jouer
        setTimeout(() => {
          onCardAction?.(activeCard.id, actionId)
          // Réinitialiser après l'animation (après ~500ms pour laisser le temps à l'animation)
          setTimeout(() => {
            setLeavingCardId(null)
            setLeavingDirection(null)
            setLeavingCard(null)
          }, 200)
        }, 300)
      }
    }
  }

  return (
    <div className="relative w-full min-h-125 max-h-175 h-[70vh] sm:h-150 md:h-162.5 flex flex-col items-center pt-4 overflow-hidden">
      {visibleCards.map((card, index) => {
        const isLeaving = leavingCardId === card.id
        // Si une carte sort, elle est à l'index 0, mais la carte suivante devient active
        // L'index d'affichage : si une carte sort, les autres montent d'un index
        const displayIndex = isLeaving
          ? 0
          : leavingCardId
            ? Math.max(0, index - 1)
            : index
        // La carte du dessus est celle qui n'est pas en train de sortir et qui est à l'index 0 après ajustement
        const isTop = !isLeaving && displayIndex === 0

        return (
          <motion.div
            key={card.id}
            layout
            initial={false}
            style={{
              position: 'absolute',
              width: '100%',
              transformOrigin: 'center center',
              zIndex: isLeaving
                ? 1000
                : STACK_PROPERTIES.maxVisibleCards - displayIndex,
              pointerEvents: isTop ? 'auto' : 'none',
            }}
            animate={
              isLeaving
                ? leavingDirection === 'bottom'
                  ? {
                      // Animation vers le bas
                      y: ANIMATION_DISTANCES.exitVertical,
                      rotate: 0,
                      opacity: 0,
                      scale: 0.8,
                      filter: 'blur(4px)',
                    }
                  : {
                      // Animation vers la gauche ou droite
                      x:
                        leavingDirection === 'left'
                          ? -ANIMATION_DISTANCES.exitHorizontal
                          : ANIMATION_DISTANCES.exitHorizontal,
                      rotate: leavingDirection === 'left' ? -25 : 25,
                      opacity: 0,
                      scale: 0.8,
                      filter: 'blur(4px)',
                    }
                : {
                    scale: 1 - displayIndex * STACK_PROPERTIES.scaleReduction,
                    y: displayIndex * ANIMATION_DISTANCES.stackYOffset,
                    x: 0,
                    rotate: 0,
                    opacity:
                      displayIndex === 0
                        ? 1
                        : 1 - displayIndex * STACK_PROPERTIES.opacityReduction,
                    filter: 'blur(0px)',
                  }
            }
            transition={
              isLeaving
                ? {
                    // Transition pour l'animation exit
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    opacity: {
                      delay: 0.1,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    },
                    filter: {
                      delay: 0.02,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    },
                    ...(leavingDirection === 'bottom'
                      ? {
                          y: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                          },
                        }
                      : {
                          x: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                          },
                          rotate: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                          },
                        }),
                    scale: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    },
                  }
                : leavingCardId && !isLeaving
                  ? {
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                      delay: isTop ? STACK_PROPERTIES.nextCardDelay : 0,
                      layout: {
                        type: 'spring',
                        stiffness: 1000,
                        damping: 60,
                        delay: isTop ? STACK_PROPERTIES.nextCardDelay : 0,
                      },
                    }
                  : {
                      // Transition normale
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      layout: {
                        type: 'spring',
                        stiffness: 800,
                        damping: 50,
                      },
                    }
            }
          >
            <div className="relative w-full h-full">
              {isTop || isLeaving ? (
                <CardController
                  card={card}
                  onAction={actionId => onCardAction?.(card.id, actionId)}
                />
              ) : (
                // Pour les cartes non visibles, rendre seulement le contour pour l'effet visuel
                // Ajouter le même padding que CardController (px-4) pour avoir la même largeur effective
                <div className="px-4">
                  <div className="w-full min-h-100 max-h-150 h-[60vh] sm:h-125 md:h-137.5 rounded-2xl bg-slate-800/50 border border-slate-700" />
                </div>
              )}

              {/* Backdrop blur pour la carte quand le tag urgent est visible */}
              {showUrgentTag && urgentTagCardId === card.id && isTop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 backdrop-blur-[2px] rounded-2xl z-40"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Tag Urgent */}
              {showUrgentTag && urgentTagCardId === card.id && isTop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-50"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="bg-red-700 text-white px-4 py-2 rounded-xl shadow-lg font-extrabold text-sm uppercase tracking-wider border border-red-500 flex items-center gap-2">
                    Urgent <AlertTriangle className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      })}

      {/* Indicateur pour les cartes restantes */}
      {remainingCount > 0 && (
        <motion.div
          className="absolute w-full flex items-center justify-center"
          style={{
            transform: `translateY(${visibleCards.length * 10}px) scale(${
              1 - visibleCards.length * STACK_PROPERTIES.scaleReduction
            })`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
          animate={{
            opacity: 0.2,
            scale: 1 - visibleCards.length * STACK_PROPERTIES.scaleReduction,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          <div className="w-full min-h-100 max-h-150 h-[60vh] sm:h-125 md:h-137.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
            <motion.p
              className="text-slate-400 text-sm font-semibold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* QuickActions - Une seule fois, en bas, gère la card active */}
      <QuickActions onAction={handleQuickAction} />
    </div>
  )
}
