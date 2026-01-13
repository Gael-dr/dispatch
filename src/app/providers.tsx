import '@/features/notification/register'
import '@/features/calendar/register'

import { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { InteractionProvider } from './interaction/InteractionProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import { useInitializeCards } from './hooks/useInitializeCards'

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
