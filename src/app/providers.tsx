import '@/features/calendar/register'
import '@/features/notification/register'

import { ReactNode, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useInitializeCards } from './hooks/useInitializeCards'
import { InteractionProvider } from './interaction/InteractionProvider'
import { router } from './router'
import { ThemeProvider } from './theme/ThemeProvider'
import { DataProvider } from './data/DataProvider'

import { JsonCardRepository } from '@/app/repositories/JsonCardRepository'
import { ApiCardRepository } from '@/app/repositories/ApiCardRepository'

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
  const repo = useMemo(() => {
    return import.meta.env.DEV
      ? new JsonCardRepository()
      : new ApiCardRepository('/api')
  }, [])

  return (
    <ThemeProvider>
      <InteractionProvider>
        <DataProvider cardRepo={repo}>
          <AppInitializer>
            {children || <RouterProvider router={router} />}
          </AppInitializer>
        </DataProvider>
      </InteractionProvider>
    </ThemeProvider>
  )
}
