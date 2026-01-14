import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'
import React from 'react'

type LucideName = keyof typeof LucideIcons

export function Icon({
  name,
  size = 16,
  className,
  ...props
}: {
  name: LucideName
  size?: number
  className?: string
} & React.SVGProps<SVGSVGElement>) {
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>>
    >
  )[name]

  if (!IconComponent) {
    // placeholder empty box to keep layout if icon missing
    return (
      <span
        className={cn('inline-block bg-slate-600/20 rounded-sm', className)}
        style={{ width: size, height: size }}
        aria-hidden
      />
    )
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={cn('inline-block', className)}
      {...props}
    />
  )
}

export default Icon
