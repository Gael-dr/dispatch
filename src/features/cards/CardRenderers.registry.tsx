import type React from 'react'
import type { Card } from '@/engine/cards/card.types'

export type CardRendererProps = {
    card: Card
    onAction?: (actionId: string) => void
}

export type CardRenderer = React.ComponentType<CardRendererProps>

const UI_RENDERERS: Record<string, CardRenderer> = {}

export function registerCardRenderer(type: string, renderer: CardRenderer) {
    UI_RENDERERS[type] = renderer
}

export function getCardRendererFor(type: string) {
    return UI_RENDERERS[type]
}
