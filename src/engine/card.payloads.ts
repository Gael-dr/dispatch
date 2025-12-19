// Card Payloads - Définitions des payloads pour chaque type de card
// ❌ Aucune dépendance à React, DOM, ou UI
// ✅ Types purs pour la sécurité de type

/**
 * Payload pour une card de type "calendar"
 */
export interface CalendarPayload {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  attendees?: string[]
  status?: 'confirmed' | 'tentative' | 'cancelled'
  // Header info (optionnel)
  sender?: {
    name: string
    role?: string
    initials: string
    avatar?: string
  }
  source?: {
    type: 'gmail' | 'linkedin' | 'direct' | 'calendar' | 'custom'
    label: string
  }
}

/**
 * Payload pour une card de type "notification"
 */
export interface NotificationPayload {
  title: string
  message: string
  icon?: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  read?: boolean
  timestamp: Date
  // Header info (optionnel)
  sender?: {
    name: string
    role?: string
    initials: string
    avatar?: string
  }
  source?: {
    type: 'gmail' | 'linkedin' | 'direct' | 'calendar' | 'custom'
    label: string
  }
}

/**
 * Union type de tous les payloads possibles
 */
export type CardPayload =
  | CalendarPayload
  | NotificationPayload
  | Record<string, unknown> // Pour les types custom
