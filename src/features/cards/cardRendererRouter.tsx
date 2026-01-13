import type { Card } from '@/engine/cards/card.types'
import { getCardRendererFor } from './CardRenderers.registry'
import { DefaultCardRenderer } from './DefaultCardRenderer'

export function getCardRenderer(
  card: Card,
  onAction?: (actionId: string) => void
) {
  const Renderer = getCardRendererFor(card.type)
  if (Renderer) return <Renderer card={card} onAction={onAction} />

  // Utilise le renderer par défaut avec CardShell
  return <DefaultCardRenderer card={card} onAction={onAction} />
}
