import type { CardBlueprint } from '../../engine/cards/cards.blueprint'
import type { NotificationPayload } from './notification.payload'

export const notificationBlueprint: CardBlueprint<NotificationPayload> = {
  type: 'notification',
  connectors: ['slack', 'gmail'],

  defaults: () => ({
    title: 'Nouvelle notification',
    priority: 'low',
  }),

  payloadFactory: seed => {
    const names = [
      'Sarah Chen',
      'Alex Rivera',
      'Emma Wilson',
      'Tom Anderson',
      'Lisa Garcia',
    ]
    const roles = [
      'Team Lead',
      'Developer',
      'Designer',
      'Product Manager',
      'QA Engineer',
    ]
    const sources = [
      { type: 'gmail' as const, label: 'Gmail' },
      { type: 'custom' as const, label: 'Slack' },
      { type: 'linkedin' as const, label: 'LinkedIn' },
      { type: 'direct' as const, label: 'Direct' },
    ]
    const severities: Array<'info' | 'warning' | 'error' | 'success'> = [
      'info',
      'warning',
      'error',
      'success',
    ]
    const messages = [
      'Nouveau message dans le canal #general',
      'Vous avez été mentionné dans un thread',
      'Nouvelle tâche assignée',
      'Rappel : Réunion dans 30 minutes',
      'Mise à jour importante disponible',
    ]

    const nameIndex = seed % names.length
    const name = names[nameIndex]
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()

    const timestamp = new Date(seed - (seed % 86400000)) // Rond à la journée

    return {
      title: 'Nouvelle notification',
      message: messages[seed % messages.length],
      timestamp,
      severity: severities[seed % severities.length],
      context: {
        message: `Notification #${seed % 1000}`,
      },
      sender: {
        name,
        role: roles[nameIndex % roles.length],
        initials,
        avatar: `https://i.pravatar.cc/150?img=${seed % 70}`,
      },
      source: sources[seed % sources.length],
      read: false,
    }
  },

  actions: () => [
    {
      id: 'mark-read',
      type: 'archive',
      label: 'Marquer comme lu',
      requiresConfirmation: false,
    },
    {
      id: 'dismiss',
      type: 'archive',
      label: 'Ignorer',
      requiresConfirmation: false,
    },
  ],
}
