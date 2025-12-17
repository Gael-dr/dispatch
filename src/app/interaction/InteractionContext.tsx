import { createContext } from 'react'
import { InteractionMode } from './useInteractionMode'

interface InteractionContextType {
  mode: InteractionMode
  setMode: (mode: InteractionMode) => void
}

export const InteractionContext = createContext<
  InteractionContextType | undefined
>(undefined)
