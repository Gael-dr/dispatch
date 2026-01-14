import { registerCard } from '@/engine/cards/card.registry'
import { notificationBlueprint } from './notification.card.blueprint'
import { NotificationCardRenderer } from './NotificationCardRenderer'

console.log('[Register] notification')

registerCard(notificationBlueprint, NotificationCardRenderer)

export {}
