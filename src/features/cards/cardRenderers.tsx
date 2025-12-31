// Card Renderers - Composants de rendu spécifiques par type de card
// ❌ Pas de logique métier, pas d'API
// ✅ Rendu pur basé sur le payload

import { CalendarPayload, NotificationPayload } from '@/engine/card.payloads'
import { Card } from '@/engine/card.types'
import { getAvailableActions } from '@/engine/policies/card.policy'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { CardActions } from './CardActions'
import { CardHeader } from './CardHeader'
import ContextBubble from '@/shared/ui/ContextBubble'

/**
 * Renderer pour une card de type "calendar"
 */
export function CalendarCardRenderer({
  payload,
  card,
  onAction,
}: {
  payload: CalendarPayload
  card: Card
  onAction?: (actionId: string) => void
}) {
  return (
    <div className="w-full min-h-100 max-h-150 h-[60vh] sm:h-125 md:h-137.5 rounded-4xl sm:rounded-4xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col">
      {/* Header avec CardHeader réutilisable */}
      {payload.sender && (
        <CardHeader
          avatar={{
            initials: payload.sender.initials,
            image: payload.sender.avatar,
          }}
          name={payload.sender.name}
          role={payload.sender.role}
          source={
            payload.source
              ? {
                  type: payload.source.type,
                  label: payload.source.label,
                }
              : undefined
          }
          timestamp={payload.startDate}
          showTopBorder={false}
        />
      )}

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
        <ContextBubble
          severity={payload.severity}
          message={payload.context?.message}
        />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
          {payload.title}
        </h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          {payload.description}
        </p>
      </div>
      {/* Actions principales à l'intérieur de la card */}
      <div className="p-3 sm:p-4 border-t border-border">
        <CardActions actions={getAvailableActions(card)} onAction={onAction} />
      </div>
    </div>
  )
}

/**
 * Renderer pour une card de type "notification"
 */
export function NotificationCardRenderer({
  payload,
  card,
  onAction,
}: {
  payload: NotificationPayload
  card: Card
  onAction?: (actionId: string) => void
}) {
  const getSeverityIcon = () => {
    switch (payload.severity) {
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />
      default:
        return <Info className="w-6 h-6 text-blue-400" />
    }
  }

  const getSeverityColor = () => {
    switch (payload.severity) {
      case 'error':
        return 'border-red-500/30 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
      case 'success':
        return 'border-green-500/30 bg-green-500/10'
      default:
        return 'border-blue-500/30 bg-blue-500/10'
    }
  }

  return (
    <div
      className={`w-full min-h-87.5 max-h-125 h-[50vh] sm:h-100 md:h-112.5 rounded-2xl sm:rounded-4xl border shadow-2xl overflow-hidden flex flex-col ${getSeverityColor()}`}
    >
      {/* Header avec CardHeader réutilisable */}
      {payload.sender ? (
        <CardHeader
          avatar={{
            initials: payload.sender.initials,
            image: payload.sender.avatar,
          }}
          name={payload.sender.name}
          role={payload.sender.role}
          source={
            payload.source
              ? {
                  type: payload.source.type,
                  label: payload.source.label,
                }
              : undefined
          }
          timestamp={payload.timestamp}
          showTopBorder={true}
          borderColor="border-red-500"
        />
      ) : (
        <div className="p-4 sm:p-6 border-b border-border/50">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            {getSeverityIcon()}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
              {payload.title}
            </h2>
          </div>
          {!payload.read && (
            <span className="inline-block px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
              Nouveau
            </span>
          )}
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          {payload.message}
        </p>
      </div>
      {/* Actions principales à l'intérieur de la card */}
      <div className="p-3 sm:p-4 border-t border-border/50">
        <CardActions actions={getAvailableActions(card)} onAction={onAction} />
      </div>
    </div>
  )
}
