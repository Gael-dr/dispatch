import type { Card } from '@/engine/cards/card.types'
import { getCardRendererFor } from './CardRenderers.registry'

export function getCardRenderer(card: Card, onAction?: (actionId: string) => void) {
  const Renderer = getCardRendererFor(card.type)
  if (Renderer) return <Renderer card={card} onAction={onAction} />

  const payload = card.payload as Record<string, unknown>
  return (
    <div className="w-full h-125 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {(payload.title as string) || card.title || 'Card'}
      </h2>
      <p className="text-foreground/60">Type: {card.type}</p>
    </div>
  )
}
