import type { CardBlueprint } from '@/engine/cards/cards.blueprint'
import type { CalendarPayload } from './calendar.payload'

export const calendarBlueprint: CardBlueprint<CalendarPayload> = {
  type: 'calendar',
  connectors: ['google_calendar', 'gmail'],

  defaults: seed => ({
    title: `Rendez-vous ${seed % 1000}`,
    priority: 'normal',
  }),

  payloadFactory: seed => {
    const start = new Date(seed + 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    
    const names = ['Jean Dupont', 'Marie Martin', 'Pierre Dubois', 'Sophie Bernard', 'Luc Moreau']
    const roles = ['Directeur', 'Manager', 'Développeur', 'Designer', 'Product Owner']
    const sources = [
      { type: 'gmail' as const, label: 'Gmail' },
      { type: 'calendar' as const, label: 'Google Calendar' },
      { type: 'linkedin' as const, label: 'LinkedIn' },
      { type: 'direct' as const, label: 'Invitation directe' },
    ]
    const severities: Array<'info' | 'warning' | 'error' | 'success'> = ['info', 'warning', 'error', 'success']

    const nameIndex = seed % names.length
    const name = names[nameIndex]
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()

    return {
      title: `Rendez-vous ${seed % 1000}`,
      description:
        'Ce rendez-vous nécessite votre attention et une prise de décision rapide.',
      startDate: start,
      endDate: end,
      location: ['Paris', 'Lyon', 'Marseille'][seed % 3],
      severity: severities[seed % severities.length],
      context: {
        message: `Contexte du rendez-vous #${seed % 1000}`,
      },
      sender: {
        name,
        role: roles[nameIndex % roles.length],
        initials,
        avatar: `https://i.pravatar.cc/150?img=${seed % 70}`,
      },
      source: sources[seed % sources.length],
      status: 'tentative' as const,
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
