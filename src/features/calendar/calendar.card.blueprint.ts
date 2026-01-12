import type { CardBlueprint } from '@/engine/cards/cards.blueprint'

export type CalendarMockPayload = {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
}

export const calendarBlueprint: CardBlueprint<CalendarMockPayload> = {
  type: 'calendar',
  connectors: ['google_calendar', 'gmail'],

  defaults: seed => ({
    title: `Rendez-vous ${seed % 1000}`,
    priority: 'normal',
  }),

  payloadFactory: seed => {
    const start = new Date(seed + 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    return {
      title: `Rendez-vous ${seed % 1000}`,
      description:
        'Ce rendez-vous nécessite votre attention et une prise de décision rapide.',
      startDate: start,
      endDate: end,
      location: ['Paris', 'Lyon', 'Marseille'][seed % 3],
    }
  },

  actions: () => [
    {
      id: 'accept',
      type: 'approve',
      label: 'Accepter',
      icon: 'Check',
      requiresConfirmation: false,
    },
    {
      id: 'schedule',
      type: 'schedule',
      label: 'Proposer un Créneau',
      icon: 'Calendar',
      requiresConfirmation: false,
    },
    {
      id: 'reject',
      type: 'reject',
      label: 'Refuser',
      icon: 'X',
      requiresConfirmation: false,
    },
  ],
}
