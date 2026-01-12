export type { CalendarPayload } from '@/features/calendar/calendar.payload'
export type { NotificationPayload } from '@/features/notification/notification.payload'

// si tu veux garder une union, laisse-la “ouverte”
export type CardPayload = Record<string, unknown>
