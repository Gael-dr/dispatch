// Router de renderers - Sélectionne le bon renderer selon le type de card
// Fichier séparé pour respecter Fast Refresh (pas de mélange composants/fonctions)

import { CalendarPayload, NotificationPayload } from '@/engine/card.payloads'
import { Card } from '@/engine/card.types'
import { CalendarCardRenderer, NotificationCardRenderer } from './cardRenderers'

/**
 * Router de renderers - Sélectionne le bon renderer selon le type de card
 */
export function getCardRenderer(
  card: Card,
  onAction?: (actionId: string) => void
) {
  switch (card.type) {
    case 'calendar':
      return (
        <CalendarCardRenderer
          payload={card.payload as CalendarPayload}
          card={card}
          onAction={onAction}
        />
      )
    case 'notification':
      return (
        <NotificationCardRenderer
          payload={card.payload as NotificationPayload}
          card={card}
          onAction={onAction}
        />
      )
    default: {
      // Fallback pour les types inconnus
      const payload = card.payload as Record<string, unknown>
      return (
        <div className="w-full h-[500px] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {(payload.title as string) || 'Card'}
          </h2>
          <p className="text-foreground/60">Type: {card.type}</p>
        </div>
      )
    }
  }
}
