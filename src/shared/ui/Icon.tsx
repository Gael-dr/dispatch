interface IconProps {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      className={`icon icon--${name} ${className || ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Icon content would be loaded from an icon library or SVG sprite */}
      <title>{name}</title>
    </svg>
  )
}
