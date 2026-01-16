import type { CardConfig } from '../../engine/cards/cards.config'
import type { NotificationPayload } from './notification.payload'

/**
 * Configuration du type de carte "notification".
 *
 * Les mocks sont gérés via les fixtures JSON dans `src/app/store/fixtures/cards.mixed.json`.
 */
export const notificationConfig: CardConfig<NotificationPayload> = {
  type: 'notification',

  connectors: ['slack', 'gmail'],

  actions: () => [],
}
