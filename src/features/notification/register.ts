import { registerCard } from '@/engine/cards/card.registry'
import { notificationConfig } from './notification.card.config'
import { NotificationCardRenderer } from './NotificationCardRenderer'

console.log('[Register] notification')

registerCard(notificationConfig, NotificationCardRenderer)
