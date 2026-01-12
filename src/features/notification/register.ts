import { registerCard } from '@/engine/cards/card.registry'

import { notificationBlueprint } from './notification.card.blueprint'
import { NotificationCardRenderer } from './NotificationCardRenderer'

registerCard(notificationBlueprint, NotificationCardRenderer)

export {}
