import { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { InteractionProvider } from './interaction/InteractionProvider'
import { ThemeProvider } from './theme/ThemeProvider'

interface ProvidersProps {
  children?: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <InteractionProvider>
        {children || <RouterProvider router={router} />}
      </InteractionProvider>
    </ThemeProvider>
  )
}
