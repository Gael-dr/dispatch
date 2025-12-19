// Card Renderers - Composants de rendu spécifiques par type de card
// ❌ Pas de logique métier, pas d'API
// ✅ Rendu pur basé sur le payload

import { CalendarPayload, NotificationPayload } from '@/engine/card.payloads'
import { Card } from '@/engine/card.types'
import { getAvailableActions } from '@/engine/policies/card.policy'
import { AlertCircle, Calendar, CheckCircle2, Info } from 'lucide-react'
import { CardActions } from './CardActions'
import { CardHeader } from './CardHeader'

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
  const getStatusColor = () => {
    switch (payload.status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400'
      case 'tentative':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-blue-500/20 text-blue-400'
    }
  }

  return (
    <div className="w-full min-h-[400px] max-h-[600px] h-[60vh] sm:h-[500px] md:h-[550px] rounded-4xl sm:rounded-4xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col">
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
          timestamp={payload.startDate}
          showTopBorder={false}
        />
      ) : (
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              {payload.title}
            </h2>
          </div>
          {payload.status && (
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor()}`}
            >
              {payload.status.toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
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
      className={`w-full min-h-[350px] max-h-[500px] h-[50vh] sm:h-[400px] md:h-[450px] rounded-2xl sm:rounded-4xl border shadow-2xl overflow-hidden flex flex-col ${getSeverityColor()}`}
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
