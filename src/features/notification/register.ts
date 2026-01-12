import { registerCardType } from '@/engine/cards/card.registry'
import { registerCardRenderer } from '@/features/cards/CardRenderers.registry'

import { notificationBlueprint } from './notification.card.blueprint'
import { NotificationCardRenderer } from './NotificationCardRenderer'

registerCardType(notificationBlueprint)
registerCardRenderer('notification', NotificationCardRenderer)

export { }
