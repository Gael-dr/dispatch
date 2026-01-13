import { cardFactory } from '@/engine/cards/factory'
import type { Card, CardTypeId } from '@/engine/cards/card.types'

export function generateMockCards(count: number = 9): Card[] {
  const calendarCount = Math.max(0, count - 3)
  const notifCount = count - calendarCount - 1

  const calendars = cardFactory.createMany('calendar', calendarCount)
  const notifications = cardFactory.createMany(
    'notification',
    notifCount,
    Date.now() + 999
  )

  // Carte de test avec un type inconnu pour tester le renderer par défaut
  const unknownCard: Card = {
    id: `unknown-card-${Date.now()}`,
    type: 'unknown' as CardTypeId, // Type inconnu
    title: 'Carte avec type inconnu',
    payload: {
      title: 'Notification système',
      description:
        'Ceci est une carte avec un type non reconnu. Elle utilise le renderer par défaut avec CardShell.',
      message: 'Le système a détecté automatiquement les informations du payload.',
      sender: {
        name: 'Système',
        role: 'Administrateur',
        initials: 'SY',
        avatar: undefined,
      },
      source: {
        type: 'custom',
        label: 'Système',
      },
      timestamp: Date.now(),
    },
    status: 'pending',
    priority: 'normal',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return shuffle([...calendars, ...notifications, unknownCard])
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
