import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ActionBarProps {
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function ActionBar({ children, position = 'bottom' }: ActionBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        position === 'top' && 'flex-col',
        position === 'bottom' && 'flex-row',
        position === 'left' && 'flex-col',
        position === 'right' && 'flex-row'
      )}
    >
      {children}
    </div>
  )
}
