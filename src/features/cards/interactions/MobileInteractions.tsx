import { ReactNode } from 'react'
import { useSwipe } from '../../../shared/hooks/useSwipe'
import { useHaptics } from '../../../shared/hooks/useHaptics'
import { Card } from '../../../engine/cards/card.types'

interface MobileInteractionsProps {
  card: Card
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: ReactNode
}

export function MobileInteractions({
  card: _card,
  onSwipeLeft,
  onSwipeRight,
  children,
}: MobileInteractionsProps) {
  const { triggerHaptic } = useHaptics()

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      triggerHaptic('light')
      onSwipeLeft?.()
    },
    onSwipeRight: () => {
      triggerHaptic('light')
      onSwipeRight?.()
    },
  })

  return <div {...swipeHandlers}>{children}</div>
}
