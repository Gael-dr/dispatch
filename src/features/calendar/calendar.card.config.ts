import type { CardConfig } from '@/engine/cards/cards.config'
import type { CalendarPayload } from './calendar.payload'

/**
 * Configuration du type de carte "calendar".
 *
 * Les mocks sont gérés via les fixtures JSON dans `src/app/store/fixtures/cards.mixed.json`.
 */
export const calendarConfig: CardConfig<CalendarPayload> = {
  type: 'calendar',

  connectors: ['google_calendar', 'gmail'],

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
