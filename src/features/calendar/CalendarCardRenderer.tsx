import type { Card } from '@/engine/cards/card.types'
import type { CalendarPayload } from '@/engine/cards/card.payloads'
import ContextBubble from '@/shared/ui/ContextBubble'
import { CardHeader } from '@/features/cards/CardHeader'
import { CardShell } from '@/features/cards/CardShell'

export function CalendarCardRenderer({
  card,
  onAction,
}: {
  card: Card
  onAction?: (actionId: string) => void
}) {
  const payload = card.payload as CalendarPayload

  const header = payload.sender ? (
    <CardHeader
      avatar={{
        initials: payload.sender.initials,
        image: payload.sender.avatar,
      }}
      name={payload.sender.name}
      role={payload.sender.role}
      source={
        payload.source
          ? { type: payload.source.type, label: payload.source.label }
          : undefined
      }
      timestamp={payload.startDate}
      showTopBorder={false}
    />
  ) : undefined

  return (
    <CardShell card={card} header={header} onAction={onAction}>
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
    </CardShell>
  )
}
