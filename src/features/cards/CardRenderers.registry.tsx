import type React from 'react'
import type { Card, CardTypeId } from '@/engine/cards/card.types'

export type CardRendererProps = {
  card: Card
  onAction?: (actionId: string) => void
}

export type CardRenderer = React.ComponentType<CardRendererProps>

const UI_RENDERERS: Partial<Record<CardTypeId, CardRenderer>> = {}

export function registerCardRenderer(type: CardTypeId, renderer: CardRenderer) {
  UI_RENDERERS[type] = renderer
}

export function getCardRendererFor(type: CardTypeId): CardRenderer | undefined {
  return UI_RENDERERS[type]
}
