// CardHeader - Header réutilisable pour toutes les cards
// ✅ S'adapte à différentes sources de contenu (Gmail, LinkedIn, etc.)

import { cn } from '@/lib/utils'
import { Eye, Linkedin, Mail, Settings, Slack } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

export interface CardHeaderSource {
  type: 'gmail' | 'linkedin' | 'direct' | 'calendar' | 'custom' | 'slack'
  label: string
  icon?: React.ReactNode
  color?: string
}

export interface CardHeaderProps {
  // Informations utilisateur
  avatar?: {
    initials: string
    image?: string
  }
  name: string
  role?: string
  // Source
  source?: CardHeaderSource
  onView?: () => void
  onSettings?: () => void
  // Timestamp
  timestamp?: Date
  // Style
  className?: string
  // Ligne rouge en haut (optionnel)
  showTopBorder?: boolean
  borderColor?: string
}

/**
 * Récupère l'icône par défaut selon le type de source
 */
function getSourceIcon(source: CardHeaderSource): React.ReactNode {
  if (source.icon) return source.icon

  switch (source.type) {
    case 'gmail':
      return <Mail className="w-3 h-3" />
    case 'linkedin':
      return <Linkedin className="w-3 h-3" />
    case 'slack':
      return <Slack className="w-3 h-3" />
    default:
      return null
  }
}

/**
 * Récupère la couleur par défaut selon le type de source
 */
function getSourceColor(source: CardHeaderSource): string {
  if (source.color) return source.color

  switch (source.type) {
    case 'gmail':
      return 'text-red-400'
    case 'linkedin':
      return 'text-blue-400'
    default:
      return 'text-muted-foreground'
  }
}

export function CardHeader({
  avatar,
  name,
  role,
  source,
  onView,
  onSettings,
  //timestamp, // TODO add saved time
  className,
  showTopBorder = false,
  borderColor = 'border-red-500',
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'p-4 sm:p-6 border-b border-border bg-[#182134]',
        showTopBorder && `border-t-2 ${borderColor}`,
        className
      )}
    >
      <div className="flex items-start justify-between gap-1">
        {/* Left side - User info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          {avatar && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-base sm:text-lg shrink-0 border border-border">
              {avatar.image ? (
                <img
                  src={avatar.image}
                  alt={name}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                avatar.initials
              )}
            </div>
          )}

          {/* Name and role */}
          <div className="flex-1 min-w-0">
            <Popover>
              <PopoverTrigger>
                <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                  {name}
                </h3>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <p className="text-sm text-muted-foreground">{name}</p>
              </PopoverContent>
            </Popover>
            {role && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {role}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Source, actions, timestamp */}
        <div className="flex items-start gap-3 shrink-0">
          {/* Source button */}
          {source && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border',
                getSourceColor(source)
              )}
            >
              {source.icon || getSourceIcon(source)}
              <span className="text-[10px] sm:text-xs font-medium">
                {source.label}
              </span>
            </div>
          )}

          {/* Action icons */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <button
                onClick={onView}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none outline-none"
                aria-label="Voir"
              >
                <Eye className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={onSettings}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none outline-none"
                aria-label="Paramètres"
              >
                <Settings className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <span className="text-[10px] sm:text-xs text-muted-foreground">
              10m
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
