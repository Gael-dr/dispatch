import type { Card } from '@/engine/cards/card.types'
import { getCardRendererFor, __debugRenderers } from './cardRenderers.registry'
import { CardShell } from './CardShell'

export function getCardRenderer(card: Card, onAction?: (actionId: string) => void) {
    const Renderer = getCardRendererFor(card.type)

    // ✅ debug temporaire
    console.log('[Router]', card.type, 'renderer?', !!Renderer, 'known:', __debugRenderers())

    if (Renderer) return <Renderer card={card} onAction={onAction} />

    const payload = card.payload as Record<string, unknown>
    return (
        <CardShell card={card} onAction={onAction} footerClassName="pt-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {(payload.title as string) || card.title || 'Card'}
            </h2>
            <p className="text-sm text-foreground/60">Type: {card.type}</p>
        </CardShell>
    )
}
