import { dtoToCard } from '@/app/store/fixtures/cards.dto'
import type { CardRepository } from '@/engine/cards/card.repository'
import type { Card } from '@/engine/cards/card.types'
import { fetchCards } from '@/shared/api/cards.api'

/**
 * Repository pour charger les cartes depuis l'API backend.
 *
 * Utilise l'API centralisée dans `src/shared/api/cards.api.ts`.
 */
export class ApiCardRepository implements CardRepository {
  async list(): Promise<Card[]> {
    const dtos = await fetchCards()
    return dtos.map(dtoToCard)
  }
}
