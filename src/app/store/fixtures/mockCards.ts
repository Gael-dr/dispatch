import type { Card } from '@/engine/cards/card.types'
import type { CardDTO } from './cards.dto'
import { dtoToCard } from './cards.dto'

import cardsMixed from './cards.mixed.json'

export function generateMockCards(_count: number = 9): Card[] {
  // count ignoré : les fixtures dictent la réalité (comme un backend)
  return (cardsMixed as CardDTO[]).map(dtoToCard)
}
