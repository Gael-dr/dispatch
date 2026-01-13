import type { Card } from '@/engine/cards/card.types'
import { CardHeader } from './CardHeader'
import { CardShell } from './CardShell'

/**
 * Renderer par défaut pour les types de cartes non reconnus
 * Utilise CardShell pour garantir une expérience cohérente
 */
export function DefaultCardRenderer({
  card,
  onAction,
}: {
  card: Card
  onAction?: (actionId: string) => void
}) {
  const payload = card.payload as Record<string, unknown>

  // Tente de créer un header si le payload contient des informations d'expéditeur
  const header =
    payload.sender &&
    typeof payload.sender === 'object' &&
    'name' in payload.sender ? (
      <CardHeader
        avatar={{
          initials:
            (payload.sender as { initials?: string })?.initials || '??',
          image: (payload.sender as { avatar?: string })?.avatar,
        }}
        name={(payload.sender as { name: string }).name || 'Unknown'}
        role={(payload.sender as { role?: string })?.role}
        source={
          payload.source &&
          typeof payload.source === 'object' &&
          'type' in payload.source &&
          'label' in payload.source
            ? {
                type: (payload.source as { type: string }).type as
                  | 'gmail'
                  | 'linkedin'
                  | 'direct'
                  | 'calendar'
                  | 'custom'
                  | 'slack',
                label: (payload.source as { label: string }).label,
              }
            : undefined
        }
        timestamp={
          payload.timestamp
            ? new Date(payload.timestamp as string | number)
            : card.createdAt
        }
        showTopBorder={false}
      />
    ) : undefined

  const title =
    (payload.title as string) || card.title || 'Card'
  const description = payload.description
    ? String(payload.description)
    : payload.message
      ? String(payload.message)
      : undefined

  return (
    <CardShell card={card} header={header} onAction={onAction}>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          {description}
        </p>
      )}
      {/* Affiche le type pour le debug (peut être masqué en production si nécessaire) */}
      <p className="text-xs text-muted-foreground mt-2">
        Type: <code className="text-foreground/60">{card.type}</code>
      </p>
    </CardShell>
  )
}
