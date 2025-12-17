import { useContext } from 'react'
import { InteractionContext } from './InteractionContext'

export function useInteractionContext() {
  const context = useContext(InteractionContext)
  if (context === undefined) {
    throw new Error(
      'useInteractionContext must be used within an InteractionProvider'
    )
  }
  return context
}
