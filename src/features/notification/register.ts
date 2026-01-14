import { registerCardType } from '@/engine/cards/card.registry'
import { registerCardRenderer } from '@/features/cards/cardRenderers.registry'
import { notificationBlueprint } from './notification.card.blueprint'
import { NotificationCardRenderer } from './NotificationCardRenderer'

console.log('[Register] notification')

registerCardType(notificationBlueprint)
registerCardRenderer('notification', NotificationCardRenderer)

export { }
