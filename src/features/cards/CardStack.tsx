import { motion } from 'framer-motion'
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
    'left' | 'right' | null
  >(null)
  const [leavingCard, setLeavingCard] = useState<Card | null>(null)

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
      const direction = activeCard.status === 'quick-done' ? 'left' : 'right'

      // Garder la carte qui sort dans l'état pour qu'elle reste visible pendant l'animation
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
                ? {
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
