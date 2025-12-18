import { cn } from '@/lib/utils'
import { useHaptics } from '@/shared/hooks/useHaptics'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import * as React from 'react'

interface SwipeToUnlockProps {
  /**
   * Texte affiché dans le slider
   * @default "Glisser pour déverrouiller"
   */
  label?: string
  /**
   * Callback appelé quand le slider est complété
   */
  onUnlock: () => void
  /**
   * Pourcentage minimum à atteindre pour déclencher le déverrouillage (0-100)
   * @default 80
   */
  threshold?: number
  /**
   * Désactive le composant
   * @default false
   */
  disabled?: boolean
  /**
   * Classes CSS supplémentaires
   */
  className?: string
}

/**
 * Composant SwipeToUnlock - Slider de type iPhone pour déverrouiller
 * Utilise Framer Motion pour une gestion simplifiée des gestes et animations
 *
 * @example
 * ```tsx
 * <SwipeToUnlock
 *   onUnlock={() => console.log('Déverrouillé!')}
 *   label="Glisser pour continuer"
 * />
 * ```
 */
export function SwipeToUnlock({
  label = 'GLISSER POUR TRAITER',
  onUnlock,
  threshold = 80,
  disabled = false,
  className,
}: SwipeToUnlockProps) {
  const [isUnlocked, setIsUnlocked] = React.useState(false)
  const [maxDrag, setMaxDrag] = React.useState(0)
  const [isInteracting, setIsInteracting] = React.useState(false)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const { triggerHaptic } = useHaptics()
  const controls = useAnimation()

  // Motion value pour la position X du bouton
  const x = useMotionValue(0)

  // Calcule la largeur maximale disponible pour le drag
  React.useEffect(() => {
    const updateMaxDrag = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.offsetWidth
        const buttonSize = 64 // h-16 = 64px (taille actuelle du bouton)
        const leftOffset = 3 // left-[3px] du bouton
        const rightMargin = 3 // Marge à droite pour éviter que le bouton sorte
        // Le bouton peut se déplacer de leftOffset jusqu'à trackWidth - buttonSize - rightMargin
        setMaxDrag(trackWidth - buttonSize - leftOffset - rightMargin)
      }
    }

    updateMaxDrag()
    window.addEventListener('resize', updateMaxDrag)
    return () => window.removeEventListener('resize', updateMaxDrag)
  }, [])

  // Transforme la position X en pourcentage de progression (0-100)
  const progress = useTransform(x, [0, maxDrag], [0, 100])

  // Taille du bouton en pixels
  const buttonSize = 64 // h-16 = 64px (taille actuelle du bouton)
  const buttonCenter = buttonSize / 2 // 32px

  // La barre commence à gauche (position 0)
  const progressLeft = '0px'

  // Calcule la largeur de la barre : commence au niveau du centre du bouton (32px) puis s'étend
  const progressWidth = useTransform(x, latestX => {
    // Largeur = centre du bouton (32px) + distance parcourue par le bouton
    return `${buttonCenter + latestX}px`
  })

  // L'opacité du label reste constante pendant le slide
  const labelOpacity = 0.7

  // Suit le pourcentage pour déclencher les haptics au bon moment
  const progressRef = React.useRef(0)
  React.useEffect(() => {
    const unsubscribe = progress.on('change', latest => {
      const currentProgress = Math.round(latest)

      // Haptic feedback quand on atteint le threshold
      if (currentProgress >= threshold && progressRef.current < threshold) {
        triggerHaptic('medium')
      }

      progressRef.current = currentProgress
    })

    return unsubscribe
  }, [progress, threshold, triggerHaptic])

  // Gère le début du drag
  const handleDragStart = React.useCallback(() => {
    if (disabled || isUnlocked) return
    setIsInteracting(true)
    triggerHaptic('light')
  }, [disabled, isUnlocked, triggerHaptic])

  // Gère la fin du drag
  const handleDragEnd = React.useCallback(
    async (_event: PointerEvent, _info: { offset: { x: number } }) => {
      if (disabled || isUnlocked) return

      const currentProgress = progressRef.current

      if (currentProgress >= threshold) {
        // Déverrouillage réussi - animation vers la fin
        setIsUnlocked(true)
        triggerHaptic('success')
        await controls.start({ x: maxDrag, scale: 1 })
        onUnlock()
      } else {
        // Retour à la position initiale avec animation spring
        await controls.start({
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
          },
        })
        // Masquer la barre après l'animation de retour
        setTimeout(() => setIsInteracting(false), 300)
      }
    },
    [
      disabled,
      isUnlocked,
      threshold,
      maxDrag,
      controls,
      onUnlock,
      triggerHaptic,
    ]
  )

  // Réinitialise quand disabled change
  React.useEffect(() => {
    if (disabled) {
      controls.set({ x: 0 })
      setIsUnlocked(false)
      x.set(0)
    }
  }, [disabled, controls, x])

  return (
    <div
      ref={trackRef}
      className={cn(
        'relative w-full max-w-sm h-18 rounded-full bg-card',
        'backdrop-blur-sm',
        'border border-border',
        'overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Barre de progression animée - commence au centre du bouton */}
      <motion.div
        className="absolute top-0 bottom-0 bg-slate-400/20"
        style={{
          left: progressLeft,
          width: progressWidth,
        }}
        animate={{
          opacity: isInteracting ? 1 : 0,
        }}
        transition={{
          duration: 0.1,
        }}
      />

      {/* Texte du label */}
      <motion.div
        className={cn(
          'absolute inset-0 flex items-center justify-center text-xs font-bold uppercase tracking-widest pointer-events-none animate-shimmer pl-10 transition-all duration-900 linear'
        )}
        style={{ opacity: labelOpacity }}
        animate={{
          textShadow: [
            '0 0 0px rgba(255, 255, 255, 0)',
            '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
            '0 0 0px rgba(255, 255, 255, 0)',
          ],
          color: [
            'rgb(100, 116, 139)', // slate-500
            'rgb(255, 255, 255)', // white
            'rgb(100, 116, 139)', // slate-500
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1], // Courbe d'animation personnalisée pour un effet plus fluide
          times: [0, 0.5, 0.5], // Répartition du temps : montée rapide, descente lente
        }}
      >
        {label}
      </motion.div>

      {/* Bouton glissant avec Framer Motion */}
      <motion.button
        type="button"
        disabled={disabled || isUnlocked}
        className={cn(
          'absolute left-[3px] top-[3px] h-16 w-16 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]',
          'rounded-full',
          'aspect-square',
          'flex items-center justify-center',
          'p-0',
          'cursor-grab active:cursor-grabbing',
          'touch-none select-none',
          'overflow-hidden',
          'outline-none focus:outline-none focus-visible:outline-none',
          disabled && 'cursor-not-allowed'
        )}
        style={{
          x,
          borderRadius: '50%',
          aspectRatio: '1 / 1',
          backgroundColor: 'white',
        }}
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.05,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        aria-label={label}
      >
        <div className="w-[24px] h-[24px] flex items-center justify-center">
          <ArrowRight
            className={cn('text-gray-600', 'transition-colors duration-200')}
            size={50}
          />
        </div>
      </motion.button>
    </div>
  )
}
