import type { CardRepository } from '@/engine/cards/card.repository'
import type { Card } from '@/engine/cards/card.types'
import type { CardDTO } from '@/app/store/fixtures/cards.dto'
import { dtoToCard } from '@/app/store/fixtures/cards.dto'

import cardsMixed from '@/app/store/fixtures/cards.mixed.json'

export class JsonCardRepository implements CardRepository {
    async list(): Promise<Card[]> {
        return (cardsMixed as CardDTO[]).map(dtoToCard)
    }
}
