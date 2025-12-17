import { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { InteractionProvider } from './interaction/InteractionProvider'

interface ProvidersProps {
  children?: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <InteractionProvider>
      {children || <RouterProvider router={router} />}
    </InteractionProvider>
  )
}
