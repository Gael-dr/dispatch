import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import { Button } from './button'
import { Icon } from './Icon'
interface ActionButtonProps {
  label: string
  buttonType: 'primary' | 'secondary' | 'destructive'
  onClick: () => void
  icon?: ComponentProps<typeof Icon>['name']
  disabled?: boolean
}

/**
 * Bouton pour les actions principales des cards
 * Style grand et visible, différent des QuickButton
 */
export function ActionButton({
  label,
  buttonType,
  onClick,
  icon,
  disabled = false,
}: ActionButtonProps) {
  // Variant du Button shadcn
  const buttonVariant =
    buttonType === 'primary'
      ? 'default'
      : buttonType === 'destructive'
        ? 'destructive'
        : 'secondary'

  // Styles spécifiques pour le bouton primary (bleu avec texte blanc)
  const getPrimaryStyles = () => {
    if (buttonType === 'primary') {
      return '!bg-blue-500 !text-white hover:!bg-blue-600'
    }
    if (buttonType === 'destructive') {
      return '!bg-red-500 !text-white hover:!bg-red-600'
    }
    if (buttonType === 'secondary') {
      return '!bg-slate-800 !text-white hover:!bg-slate-600'
    }
    return ''
  }

  return (
    <Button
      variant={buttonVariant}
      size="lg"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-30 w-full font-semibold border rounded-xl shadow-md hover:shadow-lg transition-all py-6',
        getPrimaryStyles()
      )}
    >
      {icon && <Icon name={icon} size={20} />}
      <span>{label}</span>
    </Button>
  )
}
