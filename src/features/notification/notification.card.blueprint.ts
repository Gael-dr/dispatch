import type { CardBlueprint } from '../../engine/cards/cards.blueprint'

export const notificationBlueprint: CardBlueprint<{
  message: string
  source: string
}> = {
  type: 'notification',
  connectors: ['slack', 'gmail'],

  defaults: () => ({
    title: 'Nouvelle notification',
    priority: 'low',
  }),

  payloadFactory: seed => ({
    message: `Ping #${seed % 1000}`,
    source: 'Slack (mock)',
  }),

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
