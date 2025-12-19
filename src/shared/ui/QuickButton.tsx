// QuickButton - Bouton spécifique pour les actions rapides
// ✅ Style compact et minimaliste, différent des ActionButton

import { cn } from '@/lib/utils'
import { Flag, Check, Clock, X } from 'lucide-react'

interface QuickButtonProps {
  label: string
  buttonType: 'primary' | 'secondary' | 'destructive'
  actionType?: 'defer' | 'mark-urgent' | 'mark-done' | 'ignore' | string
  onClick: () => void
  disabled?: boolean
}

/**
 * Récupère l'icône dynamique selon le type d'action
 */
function getActionIcon(actionType?: string) {
  switch (actionType) {
    case 'defer':
      return <Clock className="w-5 h-5" />
    case 'mark-urgent':
      return <Flag className="w-5 h-5" />
    case 'mark-done':
      return <Check className="w-5 h-5 text-green-500" />
    case 'ignore':
      return <X className="w-5 h-5 text-red-500" />
    default:
      return <X className="w-5 h-5" />
  }
}

/**
 * Récupère les styles de hover selon le type de bouton
 */
function getHoverStyles(buttonType: 'primary' | 'secondary' | 'destructive') {
  switch (buttonType) {
    case 'primary':
      return 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
    case 'destructive':
      return 'group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]'
    default:
      return 'group-hover:border-slate-500/50 group-hover:shadow-[0_0_20px_rgba(148,163,184,0.2)]'
  }
}

/**
 * Récupère la couleur de l'icône au hover selon le type
 */
function getIconHoverColor(
  buttonType: 'primary' | 'secondary' | 'destructive'
) {
  switch (buttonType) {
    case 'primary':
      return 'group-hover:text-blue-400'
    case 'destructive':
      return 'group-hover:text-red-400'
    default:
      return 'group-hover:text-slate-400'
  }
}

/**
 * Bouton pour les actions rapides (PLUS TARD, URGENT, FAIT, IGNORER)
 * Style compact et discret, différent des ActionButton principaux
 */
export function QuickButton({
  label,
  buttonType,
  actionType,
  onClick,
  disabled = false,
}: QuickButtonProps) {
  const IconComponent = getActionIcon(actionType)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-all group scale-90',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center transition-all',
          getHoverStyles(buttonType)
        )}
      >
        <div
          className={cn(
            'text-slate-400 transition-colors',
            getIconHoverColor(buttonType)
          )}
        >
          {IconComponent}
        </div>
      </div>
      <span className="text-[8px] font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100">
        {label}
      </span>
    </button>
  )
}
