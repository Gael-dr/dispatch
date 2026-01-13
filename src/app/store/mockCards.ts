import { cardFactory } from '@/engine/cards/factory'
import type { Card } from '@/engine/cards/card.types'

export function generateMockCards(count: number = 9): Card[] {
  const calendarCount = Math.max(0, count - 2)
  const notifCount = count - calendarCount

  const calendars = cardFactory.createMany('calendar', calendarCount)
  const notifications = cardFactory.createMany(
    'notification',
    notifCount,
    Date.now() + 999
  )

  return shuffle([...calendars, ...notifications])
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
