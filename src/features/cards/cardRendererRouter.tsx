import type { CalendarPayload, NotificationPayload } from '@/engine/cards/card.payloads'
import type { Card } from '@/engine/cards/card.types' // ✅ ici
import { CalendarCardRenderer, NotificationCardRenderer } from './cardRenderers'

export function getCardRenderer(card: Card, onAction?: (actionId: string) => void) {
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
      const payload = card.payload as Record<string, unknown>
      return (
        <div className="w-full h-125 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {(payload.title as string) || 'Card'}
          </h2>
          <p className="text-foreground/60">Type: {card.type}</p>
        </div>
      )
    }
  }
}
