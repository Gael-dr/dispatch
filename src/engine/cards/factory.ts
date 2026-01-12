import { CardFactory } from './CardFactory'
import { calendarBlueprint } from '@/features/calendar/calendar.card.blueprint'
import { notificationBlueprint } from '@/features/notification/notification.card.blueprint'

export const cardFactory = new CardFactory()
    .register(calendarBlueprint)
    .register(notificationBlueprint)
