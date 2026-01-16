import type { CalendarPayload } from '@/engine/cards/card.payloads'

export type Tone = 'direct' | 'cool' | 'formel'

export type Templates = {
  title: string
  subtitle: string
  subject: string
  byTone: Record<Tone, string>
}

export type TemplateBuilderArgs = {
  recipientName: string
  dayLabel: string
  timeLabel: string
  payload: CalendarPayload
}

export type TemplateBuilder = (args: TemplateBuilderArgs) => Templates

export const buildAcceptTemplates: TemplateBuilder = ({
  recipientName,
  dayLabel,
  timeLabel,
}) => ({
  title: 'Validation Action',
  subtitle: 'Confirmation de rendez-vous',
  subject: `RE: Rendez-vous ${dayLabel} ${timeLabel} ?`,
  byTone: {
    direct: `Ça marche ${recipientName}, c’est noté pour ${timeLabel} ${dayLabel}.
À bientôt.`,
    cool: `Yes ${recipientName} 🙌
Super, je bloque ${timeLabel} ${dayLabel}. À très vite !`,
    formel: `Bonjour ${recipientName},

Je vous confirme notre rendez-vous ${dayLabel} à ${timeLabel}.
Bien cordialement,`,
  },
})

export const buildRefuseTemplates: TemplateBuilder = ({
  recipientName,
  dayLabel,
  timeLabel,
}) => ({
  title: 'Validation Action',
  subtitle: 'Refus de rendez-vous',
  subject: `RE: Rendez-vous ${dayLabel} ${timeLabel}`,
  byTone: {
    direct: `Désolé ${recipientName}, je ne pourrai pas être disponible ${dayLabel} à ${timeLabel}.
On peut reprogrammer ?`,
    cool: `Hello ${recipientName} 👋
Je ne vais pas pouvoir ${dayLabel} à ${timeLabel}.
Tu veux qu’on cale un autre créneau ?`,
    formel: `Bonjour ${recipientName},

Je suis au regret de vous informer que je ne serai pas disponible pour notre rendez-vous ${dayLabel} à ${timeLabel}.
Je vous propose de convenir d’un autre créneau.

Bien cordialement,`,
  },
})

export const buildScheduleTemplates: TemplateBuilder = ({
  recipientName,
  dayLabel,
  timeLabel,
}) => ({
  title: 'Proposition de créneau',
  subtitle: 'Proposer un nouveau rendez-vous',
  subject: `Proposition de créneau ${dayLabel} ${timeLabel}`,
  byTone: {
    direct: `Bonjour ${recipientName},\n\nJe vous propose un créneau ${dayLabel} à ${timeLabel}. Ça vous convient ?`,
    cool: `Hello ${recipientName} 👋\n\nJe peux te proposer ${dayLabel} à ${timeLabel}. Ça te va ?`,
    formel: `Bonjour ${recipientName},\n\nJe vous propose un créneau ${dayLabel} à ${timeLabel}.\nPouvez-vous me confirmer votre disponibilité ?`,
  },
})

export const MESSAGE_BUILDERS = {
  accept: buildAcceptTemplates,
  reject: buildRefuseTemplates,
  'schedule-message': buildScheduleTemplates,
} as const

export type MessageActionId = keyof typeof MESSAGE_BUILDERS
