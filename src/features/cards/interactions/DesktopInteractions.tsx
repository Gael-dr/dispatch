import { ReactNode, useEffect } from 'react'
import { useKeyboard } from '../../../shared/hooks/useKeyboard'
import { Card } from '../../../engine/card.types'

interface DesktopInteractionsProps {
  card: Card
  onKeyPress?: (key: string) => void
  children: ReactNode
}

export function DesktopInteractions({
  card: _card,
  onKeyPress,
  children,
}: DesktopInteractionsProps) {
  const { onKeyDown } = useKeyboard()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      onKeyPress?.(event.key)
    }

    onKeyDown(handleKeyPress)
  }, [onKeyDown, onKeyPress])

  return <div>{children}</div>
}
