import { ReactNode, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { InteractionProvider } from './interaction/InteractionProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import { DataProvider } from './data/DataProvider'

import { JsonCardRepository } from '@/app/repositories/JsonCardRepository'
import { ApiCardRepository } from '@/app/repositories/ApiCardRepository'

interface ProvidersProps {
  children?: ReactNode
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
          {children || <RouterProvider router={router} />}
        </DataProvider>
      </InteractionProvider>
    </ThemeProvider>
  )
}
