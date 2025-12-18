import { Button } from './button'
import { Icon } from './Icon'

interface ActionButtonProps {
  label: string
  type: 'primary' | 'secondary' | 'destructive'
  onClick: () => void
  icon?: string
  disabled?: boolean
}

export function ActionButton({
  label,
  type,
  onClick,
  icon,
  disabled = false,
}: ActionButtonProps) {
  return (
    <Button
      variant={
        type === 'primary'
          ? 'default'
          : type === 'secondary'
            ? 'secondary'
            : 'destructive'
      }
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon name={icon} />}
      {label}
    </Button>
  )
}
