import { ReactNode } from 'react'

interface ActionBarProps {
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function ActionBar({ children, position = 'bottom' }: ActionBarProps) {
  return <div className={`action-bar action-bar--${position}`}>{children}</div>
}
