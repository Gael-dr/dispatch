import type { CardRepository } from '@/engine/cards/card.repository'
import type { Card } from '@/engine/cards/card.types'
import type { CardDTO } from '@/app/store/fixtures/cards.dto'
import { dtoToCard } from '@/app/store/fixtures/cards.dto'

export class ApiCardRepository implements CardRepository {
    constructor(private baseUrl = '/api') { }

    async list(): Promise<Card[]> {
        const res = await fetch(`${this.baseUrl}/cards`)
        if (!res.ok) throw new Error(`Failed to fetch cards (${res.status})`)
        const dtos = (await res.json()) as CardDTO[]
        return dtos.map(dtoToCard)
    }
}
