import '@/features/calendar/register'
import '@/features/notification/register'

import { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useInitializeCards } from './hooks/useInitializeCards'
import { InteractionProvider } from './interaction/InteractionProvider'
import { router } from './router'
import { ThemeProvider } from './theme/ThemeProvider'

interface ProvidersProps {
  children?: ReactNode
}

/**
 * Composant interne qui initialise les cards au démarrage.
 */
function AppInitializer({ children }: { children: ReactNode }) {
  // Charge les cartes au démarrage de l'application
  useInitializeCards()

  return <>{children}</>
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <InteractionProvider>
        <AppInitializer>
          {children || <RouterProvider router={router} />}
        </AppInitializer>
      </InteractionProvider>
    </ThemeProvider>
  )
}
