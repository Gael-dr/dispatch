import { CalendarPayload, NotificationPayload } from '@/engine/card.payloads'
import { Card, LegacyCard } from '@/engine/card.types'

/**
 * Génère des cartes mockées pour le développement
 * Utilise la nouvelle structure avec payload
 *
 * Exemple de différents types de cards :
 * - calendar : Cards de calendrier classiques
 * - notification : Cards de notification (exemple)
 */
export function generateMockCards(count: number = 9): Card[] {
  const now = new Date()
  const cards: Card[] = []

  for (let i = 1; i <= count; i++) {
    // Générer principalement des cards "calendar"
    if (i <= count - 2) {
      const senders = [
        { name: 'Xavier Niel', role: 'CEO chez Iliad', initials: 'XN' },
        { name: 'Marc Zuckerberg', role: 'CEO chez Meta', initials: 'MZ' },
        { name: 'Elon Musk', role: 'CEO chez Tesla', initials: 'EM' },
      ]
      const sources = [
        { type: 'gmail' as const, label: 'Gmail' },
        { type: 'linkedin' as const, label: 'LinkedIn' },
        { type: 'calendar' as const, label: 'Calendar' },
      ]

      const payload: CalendarPayload = {
        title: `Rendez-vous ${i}`,
        description: `Contenu du rendez-vous ${i}. Ce rendez-vous nécessite votre attention et une prise de décision rapide.`,
        startDate: new Date(now.getTime() + i * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
        location: ['Paris', 'Lyon', 'Marseille'][i % 3],
        attendees: [
          ['John Doe', 'Jane Smith'],
          ['Alice Johnson', 'Bob Wilson'],
          ['Charlie Brown'],
        ][i % 3],
        status: ['confirmed', 'tentative', 'cancelled'][i % 3] as
          | 'confirmed'
          | 'tentative'
          | 'cancelled',
        // Header info
        sender: senders[i % 3],
        source: sources[i % 3],
      }

      // Actions peuvent être définies ici ou venir de la policy
      // Si non définies, elles seront récupérées via getAvailableActions()
      cards.push({
        id: `calendar-${i}`,
        type: 'calendar',
        payload,
        // actions optionnel : si non défini, la policy les fournira
        createdAt: new Date(now.getTime() - i * 60000),
        updatedAt: new Date(now.getTime() - i * 60000),
      })
    }
    // Exemple : une card de type "notification"
    else if (i === count - 1) {
      const payload: NotificationPayload = {
        title: 'Nouvelle notification',
        message:
          'Vous avez reçu une notification importante qui nécessite votre attention.',
        severity: 'info',
        read: false,
        timestamp: new Date(now.getTime() - i * 60000),
        sender: {
          name: 'Xavier Niel',
          role: 'CEO chez Iliad',
          initials: 'XN',
        },
        source: {
          type: 'gmail',
          label: 'Gmail',
        },
      }

      cards.push({
        id: `notification-${i}`,
        type: 'notification',
        payload,
        // Les actions viendront de la policy (mark-read, dismiss)
        createdAt: new Date(now.getTime() - i * 60000),
        updatedAt: new Date(now.getTime() - i * 60000),
      })
    }
  }

  return cards
}

/**
 * Helper pour convertir une LegacyCard vers la nouvelle structure Card
 * Utile pour la migration progressive
 */
export function convertLegacyCard(legacyCard: LegacyCard): Card {
  const payload: CalendarPayload = {
    title: legacyCard.title,
    description: legacyCard.content,
    startDate: legacyCard.metadata?.startDate as Date,
    endDate: legacyCard.metadata?.endDate as Date,
    location: legacyCard.metadata?.location as string,
    attendees: legacyCard.metadata?.attendees as unknown as string[],
    status: legacyCard.metadata?.status as
      | 'confirmed'
      | 'tentative'
      | 'cancelled',
  }

  return {
    id: legacyCard.id,
    type: legacyCard.type as Card['type'],
    payload,
    createdAt: legacyCard.createdAt,
    updatedAt: legacyCard.updatedAt,
  }
}
