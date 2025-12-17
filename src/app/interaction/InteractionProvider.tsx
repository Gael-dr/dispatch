import { ReactNode, useState } from 'react'
import { InteractionMode } from './useInteractionMode'
import { InteractionContext } from './InteractionContext'

interface InteractionProviderProps {
  children: ReactNode
}

export function InteractionProvider({ children }: InteractionProviderProps) {
  const [mode, setMode] = useState<InteractionMode>('auto')

  return (
    <InteractionContext.Provider value={{ mode, setMode }}>
      {children}
    </InteractionContext.Provider>
  )
}
